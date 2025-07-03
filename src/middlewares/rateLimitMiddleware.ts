import { Request, Response, NextFunction } from 'express';
import { redisService } from '../config/redis';

export interface RateLimitOptions {
    windowMs: number; // Time window in milliseconds
    max: number; // Maximum requests per window
    message?: string; // Custom error message
    keyGenerator?: (req: Request) => string;
    skipSuccessfulRequests?: boolean;
    skipFailedRequests?: boolean;
    headers?: boolean; // Include rate limit headers
    skip?: (req: Request) => boolean;
}

/**
 * Rate limiting middleware using Redis
 */
export const rateLimitMiddleware = (options: RateLimitOptions) => {
    const {
        windowMs,
        max,
        message = 'Too many requests from this IP, please try again later.',
        keyGenerator = (req) => `rate_limit:${req.ip}`,
        skipSuccessfulRequests = false,
        skipFailedRequests = false,
        headers = true,
        skip = () => false
    } = options;

    return async (req: Request, res: Response, next: NextFunction) => {
        // Skip rate limiting if condition is met
        if (skip(req)) {
            return next();
        }

        const key = keyGenerator(req);
        const windowSeconds = Math.floor(windowMs / 1000);

        try {
            // Get current count
            const current = await redisService.get<number>(key) || 0;

            // Check if limit exceeded
            if (current >= max) {
                if (headers) {
                    res.set({
                        'X-RateLimit-Limit': max.toString(),
                        'X-RateLimit-Remaining': '0',
                        'X-RateLimit-Reset': new Date(Date.now() + windowMs).toISOString()
                    });
                }

                return res.status(429).json({
                    error: 'Too Many Requests',
                    message,
                    retryAfter: windowMs
                });
            }

            // Increment counter
            const newCount = await redisService.incrWithTTL(key, windowSeconds);

            // Set headers
            if (headers) {
                res.set({
                    'X-RateLimit-Limit': max.toString(),
                    'X-RateLimit-Remaining': Math.max(0, max - newCount).toString(),
                    'X-RateLimit-Reset': new Date(Date.now() + windowMs).toISOString()
                });
            }

            // Handle response counting
            if (!skipSuccessfulRequests || !skipFailedRequests) {
                const originalSend = res.send;
                res.send = function(data) {
                    const shouldSkip = (
                        (skipSuccessfulRequests && res.statusCode < 400) ||
                        (skipFailedRequests && res.statusCode >= 400)
                    );

                    if (shouldSkip) {
                        // Decrement counter if we should skip this request
                        redisService.get<number>(key).then(count => {
                            if (count && count > 0) {
                                redisService.set(key, (count - 1).toString(), windowSeconds).catch(console.error);
                            }
                        }).catch(console.error);
                    }

                    return originalSend.call(this, data);
                };
            }

            next();
        } catch (error) {
            console.error('Rate limit middleware error:', error);
            // Continue without rate limiting on error
            next();
        }
    };
};

/**
 * Rate limiting configurations for different endpoints
 */
export const rateLimitConfigs = {
    // General API rate limit
    general: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 100, // 100 requests per 15 minutes
        message: 'Too many requests from this IP, please try again later.'
    },

    // Authentication endpoints - stricter limits
    auth: {
        windowMs: 15 * 60 * 1000, // 15 minutes
        max: 5, // 5 attempts per 15 minutes
        message: 'Too many authentication attempts, please try again later.',
        keyGenerator: (req: Request) => `auth_limit:${req.ip}:${req.body.email || req.body.username || 'unknown'}`
    },

    // Password reset - very strict
    passwordReset: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 3, // 3 attempts per hour
        message: 'Too many password reset attempts, please try again later.',
        keyGenerator: (req: Request) => `password_reset:${req.ip}:${req.body.email || 'unknown'}`
    },

    // Admin endpoints - moderate limits
    admin: {
        windowMs: 5 * 60 * 1000, // 5 minutes
        max: 50, // 50 requests per 5 minutes
        message: 'Too many admin requests, please slow down.',
        keyGenerator: (req: Request) => `admin_limit:${(req as any).user?.payload?.userId || req.ip}`
    },

    // File upload - strict limits
    upload: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 10, // 10 uploads per hour
        message: 'Too many file uploads, please try again later.',
        keyGenerator: (req: Request) => `upload_limit:${(req as any).user?.payload?.userId || req.ip}`
    },

    // Search endpoints - moderate limits
    search: {
        windowMs: 10 * 60 * 1000, // 10 minutes
        max: 100, // 100 searches per 10 minutes
        message: 'Too many search requests, please slow down.',
        keyGenerator: (req: Request) => `search_limit:${(req as any).user?.payload?.userId || req.ip}`
    },

    // Order creation - strict limits
    order: {
        windowMs: 60 * 60 * 1000, // 1 hour
        max: 10, // 10 orders per hour
        message: 'Too many order attempts, please try again later.',
        keyGenerator: (req: Request) => `order_limit:${(req as any).user?.payload?.userId || req.ip}`
    },

    // Review submission - moderate limits
    review: {
        windowMs: 30 * 60 * 1000, // 30 minutes
        max: 5, // 5 reviews per 30 minutes
        message: 'Too many review submissions, please slow down.',
        keyGenerator: (req: Request) => `review_limit:${(req as any).user?.payload?.userId || req.ip}`
    }
};

/**
 * Create rate limiter with user-specific limits
 */
export const createUserRateLimit = (
    baseConfig: RateLimitOptions,
    userMultiplier: number = 2
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userId = (req as any).user?.payload?.userId;
        const config = { ...baseConfig };

        // Increase limits for authenticated users
        if (userId) {
            config.max = Math.floor(config.max * userMultiplier);
            config.keyGenerator = (req) => `user_limit:${userId}`;
        }

        return rateLimitMiddleware(config)(req, res, next);
    };
};

/**
 * IP whitelist for rate limiting bypass
 */
export const createIPWhitelist = (whitelistedIPs: string[]) => {
    return (req: Request) => {
        const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
        return whitelistedIPs.includes(clientIP);
    };
};

/**
 * Role-based rate limiting
 */
export const createRoleBasedRateLimit = (
    configs: Record<string, RateLimitOptions>,
    defaultConfig: RateLimitOptions
) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const userRole = (req as any).user?.payload?.role || 'guest';
        const config = configs[userRole] || defaultConfig;

        return rateLimitMiddleware(config)(req, res, next);
    };
};