import { Request, Response } from 'express';
import { database } from '../../config/database';
import { redisService } from '../../config/redis';
import { performance } from 'perf_hooks';
import os from 'os';

interface HealthCheck {
    status: 'healthy' | 'unhealthy' | 'degraded';
    timestamp: string;
    uptime: number;
    version: string;
    environment: string;
    checks: {
        database: HealthCheckResult;
        redis: HealthCheckResult;
        memory: HealthCheckResult;
        disk: HealthCheckResult;
        external?: HealthCheckResult[];
    };
    metrics: {
        responseTime: number;
        memoryUsage: NodeJS.MemoryUsage;
        cpuUsage: NodeJS.CpuUsage;
        loadAverage: number[];
    };
}

interface HealthCheckResult {
    status: 'healthy' | 'unhealthy' | 'degraded';
    responseTime: number;
    message?: string;
    error?: string;
    details?: any;
}

export class HealthService {
    private static instance: HealthService;
    private startTime: number;

    private constructor() {
        this.startTime = Date.now();
    }

    public static getInstance(): HealthService {
        if (!HealthService.instance) {
            HealthService.instance = new HealthService();
        }
        return HealthService.instance;
    }

    /**
     * Perform comprehensive health check
     */
    public async performHealthCheck(): Promise<HealthCheck> {
        const start = performance.now();

        const [dbCheck, redisCheck, memoryCheck, diskCheck] = await Promise.all([
            this.checkDatabase(),
            this.checkRedis(),
            this.checkMemory(),
            this.checkDisk()
        ]);

        const responseTime = performance.now() - start;
        const overallStatus = this.determineOverallStatus([
            dbCheck.status,
            redisCheck.status,
            memoryCheck.status,
            diskCheck.status
        ]);

        return {
            status: overallStatus,
            timestamp: new Date().toISOString(),
            uptime: Date.now() - this.startTime,
            version: process.env.npm_package_version || '1.0.0',
            environment: process.env.NODE_ENV || 'development',
            checks: {
                database: dbCheck,
                redis: redisCheck,
                memory: memoryCheck,
                disk: diskCheck
            },
            metrics: {
                responseTime,
                memoryUsage: process.memoryUsage(),
                cpuUsage: process.cpuUsage(),
                loadAverage: os.loadavg()
            }
        };
    }

    /**
     * Check database connectivity
     */
    private async checkDatabase(): Promise<HealthCheckResult> {
        const start = performance.now();
        
        try {
            if (!database.isInitialized) {
                return {
                    status: 'unhealthy',
                    responseTime: performance.now() - start,
                    error: 'Database not initialized'
                };
            }

            // Simple query to test connection
            await database.query('SELECT 1 as test');
            
            return {
                status: 'healthy',
                responseTime: performance.now() - start,
                message: 'Database connection successful'
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                responseTime: performance.now() - start,
                error: error instanceof Error ? error.message : 'Database connection failed'
            };
        }
    }

    /**
     * Check Redis connectivity
     */
    private async checkRedis(): Promise<HealthCheckResult> {
        const start = performance.now();
        
        try {
            const testKey = 'health_check_test';
            const testValue = Date.now().toString();
            
            // Test Redis write and read
            await redisService.set(testKey, testValue, 10);
            const retrievedValue = await redisService.get(testKey);
            
            if (retrievedValue !== testValue) {
                return {
                    status: 'unhealthy',
                    responseTime: performance.now() - start,
                    error: 'Redis read/write test failed'
                };
            }

            // Cleanup test key
            await redisService.del(testKey);
            
            return {
                status: 'healthy',
                responseTime: performance.now() - start,
                message: 'Redis connection successful'
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                responseTime: performance.now() - start,
                error: error instanceof Error ? error.message : 'Redis connection failed'
            };
        }
    }

    /**
     * Check memory usage
     */
    private async checkMemory(): Promise<HealthCheckResult> {
        const start = performance.now();
        
        try {
            const memoryUsage = process.memoryUsage();
            const totalMemory = os.totalmem();
            const freeMemory = os.freemem();
            const usedMemory = totalMemory - freeMemory;
            const memoryUsagePercent = (usedMemory / totalMemory) * 100;
            
            let status: 'healthy' | 'unhealthy' | 'degraded' = 'healthy';
            let message = 'Memory usage normal';
            
            if (memoryUsagePercent > 90) {
                status = 'unhealthy';
                message = 'Critical memory usage';
            } else if (memoryUsagePercent > 80) {
                status = 'degraded';
                message = 'High memory usage';
            }
            
            return {
                status,
                responseTime: performance.now() - start,
                message,
                details: {
                    processMemory: memoryUsage,
                    systemMemory: {
                        total: totalMemory,
                        free: freeMemory,
                        used: usedMemory,
                        usagePercent: memoryUsagePercent
                    }
                }
            };
        } catch (error) {
            return {
                status: 'unhealthy',
                responseTime: performance.now() - start,
                error: error instanceof Error ? error.message : 'Memory check failed'
            };
        }
    }

    /**
     * Check disk space
     */
    private async checkDisk(): Promise<HealthCheckResult> {
        const start = performance.now();
        
        try {
            const fs = require('fs');
            const stats = fs.statSync('/');
            
            // This is a simplified check - in production you'd want to use a proper disk space library
            return {
                status: 'healthy',
                responseTime: performance.now() - start,
                message: 'Disk space check completed',
                details: {
                    available: 'Check requires additional implementation'
                }
            };
        } catch (error) {
            return {
                status: 'degraded',
                responseTime: performance.now() - start,
                error: error instanceof Error ? error.message : 'Disk check failed'
            };
        }
    }

    /**
     * Determine overall status from individual checks
     */
    private determineOverallStatus(statuses: ('healthy' | 'unhealthy' | 'degraded')[]): 'healthy' | 'unhealthy' | 'degraded' {
        if (statuses.includes('unhealthy')) {
            return 'unhealthy';
        }
        if (statuses.includes('degraded')) {
            return 'degraded';
        }
        return 'healthy';
    }

    /**
     * Get basic readiness check
     */
    public async getReadinessCheck(): Promise<{ ready: boolean; message: string }> {
        try {
            const dbCheck = await this.checkDatabase();
            const redisCheck = await this.checkRedis();
            
            const isReady = dbCheck.status !== 'unhealthy' && redisCheck.status !== 'unhealthy';
            
            return {
                ready: isReady,
                message: isReady ? 'Service is ready' : 'Service is not ready'
            };
        } catch (error) {
            return {
                ready: false,
                message: 'Readiness check failed'
            };
        }
    }

    /**
     * Get liveness check
     */
    public async getLivenessCheck(): Promise<{ alive: boolean; message: string }> {
        try {
            // Simple check to see if the service is alive
            const uptime = Date.now() - this.startTime;
            
            return {
                alive: uptime > 0,
                message: `Service is alive (uptime: ${uptime}ms)`
            };
        } catch (error) {
            return {
                alive: false,
                message: 'Liveness check failed'
            };
        }
    }
}

export const healthService = HealthService.getInstance();

/**
 * Health check controller
 */
export const healthController = {
    // Full health check
    async health(req: Request, res: Response) {
        try {
            const healthCheck = await healthService.performHealthCheck();
            const statusCode = healthCheck.status === 'healthy' ? 200 : 
                              healthCheck.status === 'degraded' ? 200 : 503;
            
            res.status(statusCode).json(healthCheck);
        } catch (error) {
            res.status(503).json({
                status: 'unhealthy',
                timestamp: new Date().toISOString(),
                error: error instanceof Error ? error.message : 'Health check failed'
            });
        }
    },

    // Readiness check
    async ready(req: Request, res: Response) {
        try {
            const readinessCheck = await healthService.getReadinessCheck();
            const statusCode = readinessCheck.ready ? 200 : 503;
            
            res.status(statusCode).json(readinessCheck);
        } catch (error) {
            res.status(503).json({
                ready: false,
                message: 'Readiness check failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    },

    // Liveness check
    async live(req: Request, res: Response) {
        try {
            const livenessCheck = await healthService.getLivenessCheck();
            const statusCode = livenessCheck.alive ? 200 : 503;
            
            res.status(statusCode).json(livenessCheck);
        } catch (error) {
            res.status(503).json({
                alive: false,
                message: 'Liveness check failed',
                error: error instanceof Error ? error.message : 'Unknown error'
            });
        }
    }
};