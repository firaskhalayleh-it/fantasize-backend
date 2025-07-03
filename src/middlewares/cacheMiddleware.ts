import { Request, Response, NextFunction } from 'express';
import { redisService } from '../config/redis';

export interface CacheOptions {
    ttl?: number; // Time to live in seconds
    keyPrefix?: string;
    cacheCondition?: (req: Request) => boolean;
    keyGenerator?: (req: Request) => string;
    skipCache?: boolean;
}

/**
 * Cache middleware for API responses
 */
export const cacheMiddleware = (options: CacheOptions = {}) => {
    const {
        ttl = 300, // 5 minutes default
        keyPrefix = 'api_cache',
        cacheCondition = (req) => req.method === 'GET',
        keyGenerator = (req) => `${req.method}:${req.originalUrl}`,
        skipCache = false
    } = options;

    return async (req: Request, res: Response, next: NextFunction) => {
        // Skip caching if disabled or condition not met
        if (skipCache || !cacheCondition(req)) {
            return next();
        }

        const cacheKey = `${keyPrefix}:${keyGenerator(req)}`;

        try {
            // Try to get cached response
            const cachedResponse = await redisService.get<{
                data: any;
                statusCode: number;
                headers?: Record<string, string>;
            }>(cacheKey);

            if (cachedResponse) {
                // Set headers if they exist
                if (cachedResponse.headers) {
                    Object.entries(cachedResponse.headers).forEach(([key, value]) => {
                        res.set(key, value);
                    });
                }

                // Set cache hit header
                res.set('X-Cache', 'HIT');
                res.set('X-Cache-Key', cacheKey);

                return res.status(cachedResponse.statusCode).json(cachedResponse.data);
            }

            // Cache miss - continue to next middleware
            res.set('X-Cache', 'MISS');
            res.set('X-Cache-Key', cacheKey);

            // Store original json method
            const originalJson = res.json;

            // Override json method to cache the response
            res.json = function(data: any) {
                // Cache the response
                const responseToCache = {
                    data,
                    statusCode: res.statusCode,
                    headers: {
                        'Content-Type': 'application/json',
                        ...res.getHeaders()
                    }
                };

                // Only cache successful responses
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    redisService.set(cacheKey, responseToCache, ttl).catch(error => {
                        console.error('Failed to cache response:', error);
                    });
                }

                // Call original json method
                return originalJson.call(this, data);
            };

            next();
        } catch (error) {
            console.error('Cache middleware error:', error);
            // Continue without caching on error
            next();
        }
    };
};

/**
 * Cache invalidation middleware
 */
export const invalidateCache = (patterns: string[] | string) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        const patternsArray = Array.isArray(patterns) ? patterns : [patterns];

        try {
            const deletePromises = patternsArray.map(pattern => 
                redisService.deletePattern(pattern)
            );
            
            await Promise.all(deletePromises);
            console.log('Cache invalidated for patterns:', patternsArray);
        } catch (error) {
            console.error('Cache invalidation error:', error);
        }

        next();
    };
};

/**
 * Cache warming function
 */
export const warmCache = async (
    url: string,
    cacheKey: string,
    data: any,
    ttl: number = 300
): Promise<void> => {
    try {
        const responseToCache = {
            data,
            statusCode: 200,
            headers: {
                'Content-Type': 'application/json'
            }
        };

        await redisService.set(cacheKey, responseToCache, ttl);
        console.log(`Cache warmed for key: ${cacheKey}`);
    } catch (error) {
        console.error('Cache warming error:', error);
    }
};

/**
 * Specific cache configurations for different endpoints
 */
export const cacheConfigs = {
    // Products - cache for 10 minutes
    products: {
        ttl: 600,
        keyPrefix: 'products',
        keyGenerator: (req: Request) => `${req.method}:${req.originalUrl}:${req.query.page || 1}:${req.query.limit || 10}`
    },

    // Categories - cache for 30 minutes
    categories: {
        ttl: 1800,
        keyPrefix: 'categories',
        keyGenerator: (req: Request) => `${req.method}:${req.originalUrl}`
    },

    // Packages - cache for 10 minutes
    packages: {
        ttl: 600,
        keyPrefix: 'packages',
        keyGenerator: (req: Request) => `${req.method}:${req.originalUrl}:${req.query.page || 1}:${req.query.limit || 10}`
    },

    // Offers - cache for 5 minutes
    offers: {
        ttl: 300,
        keyPrefix: 'offers',
        keyGenerator: (req: Request) => `${req.method}:${req.originalUrl}`
    },

    // Reviews - cache for 15 minutes
    reviews: {
        ttl: 900,
        keyPrefix: 'reviews',
        keyGenerator: (req: Request) => `${req.method}:${req.originalUrl}:${req.query.page || 1}:${req.query.limit || 10}`
    },

    // Dashboard - cache for 2 minutes
    dashboard: {
        ttl: 120,
        keyPrefix: 'dashboard',
        keyGenerator: (req: Request) => `${req.method}:${req.originalUrl}:${(req as any).user?.payload?.userId || 'anonymous'}`
    }
};

/**
 * Cache invalidation patterns for different operations
 */
export const invalidationPatterns = {
    products: ['products:*'],
    categories: ['categories:*', 'products:*'],
    packages: ['packages:*'],
    offers: ['offers:*'],
    reviews: ['reviews:*'],
    dashboard: ['dashboard:*'],
    user: (userId: string) => [`*:${userId}:*`],
    all: ['*']
};