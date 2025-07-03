import Redis from 'ioredis';
import 'dotenv/config';

export class RedisService {
    private static instance: RedisService;
    private redis: Redis;

    private constructor() {
        const redisConfig = {
            host: process.env.REDIS_HOST || 'localhost',
            port: parseInt(process.env.REDIS_PORT || '6379', 10),
            password: process.env.REDIS_PASSWORD || undefined,
            retryDelayOnFailover: 100,
            maxRetriesPerRequest: 3,
            lazyConnect: true,
            keepAlive: 30000,
            connectionTimeout: 10000,
            commandTimeout: 5000,
        };

        this.redis = new Redis(redisConfig);

        this.redis.on('connect', () => {
            console.log('Redis connected successfully');
        });

        this.redis.on('error', (error) => {
            console.error('Redis connection error:', error);
        });

        this.redis.on('close', () => {
            console.log('Redis connection closed');
        });
    }

    public static getInstance(): RedisService {
        if (!RedisService.instance) {
            RedisService.instance = new RedisService();
        }
        return RedisService.instance;
    }

    public getClient(): Redis {
        return this.redis;
    }

    /**
     * Set a key-value pair with optional TTL
     */
    public async set(key: string, value: string | object, ttl?: number): Promise<void> {
        try {
            const stringValue = typeof value === 'string' ? value : JSON.stringify(value);
            if (ttl) {
                await this.redis.setex(key, ttl, stringValue);
            } else {
                await this.redis.set(key, stringValue);
            }
        } catch (error) {
            console.error('Redis set error:', error);
            throw error;
        }
    }

    /**
     * Get a value by key
     */
    public async get<T = string>(key: string): Promise<T | null> {
        try {
            const value = await this.redis.get(key);
            if (!value) return null;
            
            try {
                return JSON.parse(value) as T;
            } catch {
                return value as T;
            }
        } catch (error) {
            console.error('Redis get error:', error);
            return null;
        }
    }

    /**
     * Delete a key
     */
    public async del(key: string): Promise<boolean> {
        try {
            const result = await this.redis.del(key);
            return result > 0;
        } catch (error) {
            console.error('Redis del error:', error);
            return false;
        }
    }

    /**
     * Check if a key exists
     */
    public async exists(key: string): Promise<boolean> {
        try {
            const result = await this.redis.exists(key);
            return result === 1;
        } catch (error) {
            console.error('Redis exists error:', error);
            return false;
        }
    }

    /**
     * Set TTL for a key
     */
    public async expire(key: string, ttl: number): Promise<boolean> {
        try {
            const result = await this.redis.expire(key, ttl);
            return result === 1;
        } catch (error) {
            console.error('Redis expire error:', error);
            return false;
        }
    }

    /**
     * Get all keys matching a pattern
     */
    public async keys(pattern: string): Promise<string[]> {
        try {
            return await this.redis.keys(pattern);
        } catch (error) {
            console.error('Redis keys error:', error);
            return [];
        }
    }

    /**
     * Delete all keys matching a pattern
     */
    public async deletePattern(pattern: string): Promise<number> {
        try {
            const keys = await this.keys(pattern);
            if (keys.length === 0) return 0;
            
            const result = await this.redis.del(...keys);
            return result;
        } catch (error) {
            console.error('Redis deletePattern error:', error);
            return 0;
        }
    }

    /**
     * Increment a counter
     */
    public async incr(key: string): Promise<number> {
        try {
            return await this.redis.incr(key);
        } catch (error) {
            console.error('Redis incr error:', error);
            throw error;
        }
    }

    /**
     * Increment a counter with TTL
     */
    public async incrWithTTL(key: string, ttl: number): Promise<number> {
        try {
            const multi = this.redis.multi();
            multi.incr(key);
            multi.expire(key, ttl);
            const results = await multi.exec();
            return results?.[0]?.[1] as number || 0;
        } catch (error) {
            console.error('Redis incrWithTTL error:', error);
            throw error;
        }
    }

    /**
     * Get multiple keys
     */
    public async mget<T = string>(keys: string[]): Promise<(T | null)[]> {
        try {
            const values = await this.redis.mget(...keys);
            return values.map(value => {
                if (!value) return null;
                try {
                    return JSON.parse(value) as T;
                } catch {
                    return value as T;
                }
            });
        } catch (error) {
            console.error('Redis mget error:', error);
            return new Array(keys.length).fill(null);
        }
    }

    /**
     * Set multiple key-value pairs
     */
    public async mset(keyValuePairs: Record<string, string | object>): Promise<void> {
        try {
            const pairs: string[] = [];
            for (const [key, value] of Object.entries(keyValuePairs)) {
                pairs.push(key, typeof value === 'string' ? value : JSON.stringify(value));
            }
            await this.redis.mset(...pairs);
        } catch (error) {
            console.error('Redis mset error:', error);
            throw error;
        }
    }

    /**
     * Close the Redis connection
     */
    public async close(): Promise<void> {
        try {
            await this.redis.quit();
        } catch (error) {
            console.error('Redis close error:', error);
        }
    }
}

export const redisService = RedisService.getInstance();