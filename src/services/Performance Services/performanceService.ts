import { Request, Response, NextFunction } from 'express';
import { performance } from 'perf_hooks';
import { redisService } from '../../config/redis';

interface PerformanceMetrics {
    route: string;
    method: string;
    responseTime: number;
    statusCode: number;
    timestamp: number;
    memoryUsage: NodeJS.MemoryUsage;
    userAgent?: string;
    userId?: string;
}

interface AggregatedMetrics {
    totalRequests: number;
    averageResponseTime: number;
    errorRate: number;
    slowRequests: number;
    requestsPerSecond: number;
    memoryUsage: {
        average: number;
        peak: number;
    };
    topEndpoints: Array<{
        endpoint: string;
        count: number;
        averageResponseTime: number;
    }>;
    statusCodes: Record<string, number>;
}

export class PerformanceMonitoringService {
    private static instance: PerformanceMonitoringService;
    private metrics: PerformanceMetrics[] = [];
    private readonly maxMetrics = 10000; // Keep last 10k metrics in memory
    private readonly slowRequestThreshold = 1000; // 1 second

    private constructor() {
        // Start periodic cleanup
        setInterval(() => this.cleanupMetrics(), 60000); // Every minute
    }

    public static getInstance(): PerformanceMonitoringService {
        if (!PerformanceMonitoringService.instance) {
            PerformanceMonitoringService.instance = new PerformanceMonitoringService();
        }
        return PerformanceMonitoringService.instance;
    }

    /**
     * Record a request metric
     */
    public recordMetric(metric: PerformanceMetrics): void {
        this.metrics.push(metric);
        
        // Keep only the last N metrics
        if (this.metrics.length > this.maxMetrics) {
            this.metrics = this.metrics.slice(-this.maxMetrics);
        }

        // Store in Redis for persistence (async)
        this.storeMetricInRedis(metric).catch(console.error);
    }

    /**
     * Store metric in Redis
     */
    private async storeMetricInRedis(metric: PerformanceMetrics): Promise<void> {
        const key = `performance:${Date.now()}`;
        await redisService.set(key, metric, 3600); // Keep for 1 hour
    }

    /**
     * Get aggregated metrics for a time period
     */
    public getAggregatedMetrics(timeWindowMs: number = 300000): AggregatedMetrics {
        const now = Date.now();
        const cutoff = now - timeWindowMs;
        
        const recentMetrics = this.metrics.filter(m => m.timestamp > cutoff);
        
        if (recentMetrics.length === 0) {
            return {
                totalRequests: 0,
                averageResponseTime: 0,
                errorRate: 0,
                slowRequests: 0,
                requestsPerSecond: 0,
                memoryUsage: { average: 0, peak: 0 },
                topEndpoints: [],
                statusCodes: {}
            };
        }

        const totalRequests = recentMetrics.length;
        const averageResponseTime = recentMetrics.reduce((sum, m) => sum + m.responseTime, 0) / totalRequests;
        const errorRequests = recentMetrics.filter(m => m.statusCode >= 400).length;
        const errorRate = (errorRequests / totalRequests) * 100;
        const slowRequests = recentMetrics.filter(m => m.responseTime > this.slowRequestThreshold).length;
        const requestsPerSecond = totalRequests / (timeWindowMs / 1000);
        
        // Memory usage calculations
        const memoryUsages = recentMetrics.map(m => m.memoryUsage.heapUsed);
        const averageMemory = memoryUsages.reduce((sum, mem) => sum + mem, 0) / memoryUsages.length;
        const peakMemory = Math.max(...memoryUsages);
        
        // Top endpoints
        const endpointCounts = new Map<string, { count: number; totalResponseTime: number }>();
        recentMetrics.forEach(m => {
            const endpoint = `${m.method} ${m.route}`;
            const current = endpointCounts.get(endpoint) || { count: 0, totalResponseTime: 0 };
            endpointCounts.set(endpoint, {
                count: current.count + 1,
                totalResponseTime: current.totalResponseTime + m.responseTime
            });
        });
        
        const topEndpoints = Array.from(endpointCounts.entries())
            .map(([endpoint, data]) => ({
                endpoint,
                count: data.count,
                averageResponseTime: data.totalResponseTime / data.count
            }))
            .sort((a, b) => b.count - a.count)
            .slice(0, 10);
        
        // Status codes
        const statusCodes: Record<string, number> = {};
        recentMetrics.forEach(m => {
            const code = m.statusCode.toString();
            statusCodes[code] = (statusCodes[code] || 0) + 1;
        });

        return {
            totalRequests,
            averageResponseTime,
            errorRate,
            slowRequests,
            requestsPerSecond,
            memoryUsage: {
                average: averageMemory,
                peak: peakMemory
            },
            topEndpoints,
            statusCodes
        };
    }

    /**
     * Get slow requests
     */
    public getSlowRequests(limit: number = 10): PerformanceMetrics[] {
        return this.metrics
            .filter(m => m.responseTime > this.slowRequestThreshold)
            .sort((a, b) => b.responseTime - a.responseTime)
            .slice(0, limit);
    }

    /**
     * Clean up old metrics
     */
    private cleanupMetrics(): void {
        const now = Date.now();
        const oneHourAgo = now - (60 * 60 * 1000);
        
        this.metrics = this.metrics.filter(m => m.timestamp > oneHourAgo);
    }

    /**
     * Get performance summary
     */
    public getPerformanceSummary(): {
        last5Minutes: AggregatedMetrics;
        last15Minutes: AggregatedMetrics;
        last1Hour: AggregatedMetrics;
        slowRequests: PerformanceMetrics[];
    } {
        return {
            last5Minutes: this.getAggregatedMetrics(5 * 60 * 1000),
            last15Minutes: this.getAggregatedMetrics(15 * 60 * 1000),
            last1Hour: this.getAggregatedMetrics(60 * 60 * 1000),
            slowRequests: this.getSlowRequests()
        };
    }
}

export const performanceMonitoringService = PerformanceMonitoringService.getInstance();

/**
 * Performance monitoring middleware
 */
export const performanceMiddleware = (req: Request, res: Response, next: NextFunction) => {
    const startTime = performance.now();
    const startMemory = process.memoryUsage();

    // Override the end method to capture metrics
    const originalEnd = res.end.bind(res);
    res.end = function(chunk?: any, encoding?: BufferEncoding | (() => void), cb?: () => void) {
        const endTime = performance.now();
        const responseTime = endTime - startTime;
        const endMemory = process.memoryUsage();

        // Record the metric
        const metric: PerformanceMetrics = {
            route: req.route?.path || req.path,
            method: req.method,
            responseTime,
            statusCode: res.statusCode,
            timestamp: Date.now(),
            memoryUsage: endMemory,
            userAgent: req.get('user-agent'),
            userId: (req as any).user?.payload?.userId
        };

        performanceMonitoringService.recordMetric(metric);

        // Log slow requests
        if (responseTime > 1000) {
            console.warn(`Slow request detected: ${req.method} ${req.originalUrl} - ${responseTime.toFixed(2)}ms`);
        }

        // Call original end method
        return originalEnd(chunk, encoding as BufferEncoding, cb);
    };

    next();
};

/**
 * Performance controller for endpoints
 */
export const performanceController = {
    // Get performance metrics
    async getMetrics(req: Request, res: Response) {
        try {
            const timeWindow = parseInt(req.query.timeWindow as string) || 300000; // 5 minutes default
            const metrics = performanceMonitoringService.getAggregatedMetrics(timeWindow);
            
            res.json({
                success: true,
                data: metrics,
                timeWindow: timeWindow
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get metrics'
            });
        }
    },

    // Get slow requests
    async getSlowRequests(req: Request, res: Response) {
        try {
            const limit = parseInt(req.query.limit as string) || 10;
            const slowRequests = performanceMonitoringService.getSlowRequests(limit);
            
            res.json({
                success: true,
                data: slowRequests
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get slow requests'
            });
        }
    },

    // Get performance summary
    async getSummary(req: Request, res: Response) {
        try {
            const summary = performanceMonitoringService.getPerformanceSummary();
            
            res.json({
                success: true,
                data: summary
            });
        } catch (error) {
            res.status(500).json({
                success: false,
                error: error instanceof Error ? error.message : 'Failed to get performance summary'
            });
        }
    }
};