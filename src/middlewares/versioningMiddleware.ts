import { Request, Response, NextFunction } from 'express';

export interface ApiVersionConfig {
    version: string;
    deprecated?: boolean;
    deprecationDate?: Date;
    supportEndDate?: Date;
    deprecationMessage?: string;
}

/**
 * API versioning middleware
 */
export class ApiVersioningService {
    private static supportedVersions: Map<string, ApiVersionConfig> = new Map();

    /**
     * Register a supported API version
     */
    public static registerVersion(config: ApiVersionConfig): void {
        this.supportedVersions.set(config.version, config);
    }

    /**
     * Initialize default API versions
     */
    public static initializeVersions(): void {
        // Register current versions
        this.registerVersion({
            version: 'v1',
            deprecated: false
        });

        this.registerVersion({
            version: 'v2',
            deprecated: false
        });

        // Example of deprecated version
        this.registerVersion({
            version: 'v0',
            deprecated: true,
            deprecationDate: new Date('2024-01-01'),
            supportEndDate: new Date('2024-12-31'),
            deprecationMessage: 'API v0 is deprecated. Please migrate to v1 or v2.'
        });
    }

    /**
     * Extract API version from request
     */
    private static extractVersion(req: Request): string | null {
        // Check header first
        const headerVersion = req.headers['api-version'] as string;
        if (headerVersion) {
            return headerVersion;
        }

        // Check URL path
        const pathMatch = req.path.match(/^\/api\/(v\d+)\//);
        if (pathMatch) {
            return pathMatch[1];
        }

        // Check query parameter
        const queryVersion = req.query.version as string;
        if (queryVersion) {
            return queryVersion;
        }

        return null;
    }

    /**
     * Validate API version
     */
    private static validateVersion(version: string): {
        valid: boolean;
        config?: ApiVersionConfig;
        error?: string;
    } {
        const config = this.supportedVersions.get(version);
        
        if (!config) {
            return {
                valid: false,
                error: `Unsupported API version: ${version}. Supported versions: ${Array.from(this.supportedVersions.keys()).join(', ')}`
            };
        }

        // Check if version is still supported
        if (config.supportEndDate && new Date() > config.supportEndDate) {
            return {
                valid: false,
                error: `API version ${version} is no longer supported. Support ended on ${config.supportEndDate.toISOString()}`
            };
        }

        return { valid: true, config };
    }

    /**
     * API versioning middleware
     */
    public static middleware() {
        return (req: Request, res: Response, next: NextFunction) => {
            const version = this.extractVersion(req);

            // If no version specified, default to latest
            if (!version) {
                req.apiVersion = 'v2'; // Default to latest
                return next();
            }

            // Validate version
            const validation = this.validateVersion(version);
            if (!validation.valid) {
                return res.status(400).json({
                    error: 'Invalid API Version',
                    message: validation.error,
                    supportedVersions: Array.from(this.supportedVersions.keys())
                });
            }

            // Set version in request
            req.apiVersion = version;

            // Add deprecation warnings if needed
            if (validation.config?.deprecated) {
                res.set('Deprecation', 'true');
                res.set('Sunset', validation.config.supportEndDate?.toISOString() || '');
                
                if (validation.config.deprecationMessage) {
                    res.set('Warning', `299 - "${validation.config.deprecationMessage}"`);
                }
            }

            // Add version to response headers
            res.set('API-Version', version);
            res.set('API-Supported-Versions', Array.from(this.supportedVersions.keys()).join(', '));

            next();
        };
    }

    /**
     * Version-specific route handler
     */
    public static versionHandler(handlers: Record<string, (req: Request, res: Response, next: NextFunction) => void>) {
        return (req: Request, res: Response, next: NextFunction) => {
            const version = req.apiVersion || 'v2';
            const handler = handlers[version];

            if (!handler) {
                return res.status(501).json({
                    error: 'Not Implemented',
                    message: `Endpoint not implemented for API version ${version}`,
                    availableVersions: Object.keys(handlers)
                });
            }

            handler(req, res, next);
        };
    }

    /**
     * Get all supported versions
     */
    public static getSupportedVersions(): ApiVersionConfig[] {
        return Array.from(this.supportedVersions.values());
    }
}

// Extend Express Request interface
declare global {
    namespace Express {
        interface Request {
            apiVersion?: string;
        }
    }
}

/**
 * Response standardization middleware
 */
export const standardizeResponse = (req: Request, res: Response, next: NextFunction) => {
    // Store original json method
    const originalJson = res.json.bind(res);

    // Override json method to add standard metadata
    res.json = function(data: any) {
        const standardResponse = {
            success: res.statusCode >= 200 && res.statusCode < 300,
            data: data,
            meta: {
                version: req.apiVersion || 'v2',
                timestamp: new Date().toISOString(),
                requestId: req.headers['x-request-id'] || generateRequestId(),
                ...(res.statusCode >= 400 && { 
                    error: {
                        code: res.statusCode,
                        message: data.message || data.error || 'An error occurred'
                    }
                })
            }
        };

        return originalJson(standardResponse);
    };

    next();
};

/**
 * Generate unique request ID
 */
function generateRequestId(): string {
    return `req_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
}

/**
 * Backwards compatibility middleware
 */
export const backwardsCompatibility = (req: Request, res: Response, next: NextFunction) => {
    const version = req.apiVersion;

    // Handle backwards compatibility transformations
    if (version === 'v0' || version === 'v1') {
        // Transform newer features to older format
        const originalJson = res.json.bind(res);
        res.json = function(data: any) {
            // Remove new fields that didn't exist in older versions
            if (data && typeof data === 'object') {
                const compatibleData = transformToCompatibleFormat(data, version);
                return originalJson(compatibleData);
            }
            return originalJson(data);
        };
    }

    next();
};

/**
 * Transform data to be compatible with older API versions
 */
function transformToCompatibleFormat(data: any, version: string): any {
    if (version === 'v0') {
        // Remove features introduced in v1 and v2
        const { meta, ...legacyData } = data;
        return legacyData;
    } else if (version === 'v1') {
        // Remove features introduced in v2
        if (data.meta) {
            const { requestId, ...v1Meta } = data.meta;
            data.meta = v1Meta;
        }
    }
    
    return data;
}

/**
 * API version controller
 */
export const versionController = {
    // Get supported versions
    async getSupportedVersions(req: Request, res: Response) {
        try {
            const versions = ApiVersioningService.getSupportedVersions();
            
            res.json({
                supportedVersions: versions,
                currentVersion: req.apiVersion || 'v2',
                deprecatedVersions: versions.filter(v => v.deprecated),
                recommendedVersion: 'v2'
            });
        } catch (error) {
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to retrieve API versions'
            });
        }
    },

    // Get API documentation links
    async getApiDocs(req: Request, res: Response) {
        try {
            const version = req.apiVersion || 'v2';
            
            res.json({
                version,
                documentation: {
                    swagger: `/api-docs/${version}`,
                    postman: `/api-docs/${version}/postman`,
                    examples: `/api-docs/${version}/examples`
                },
                endpoints: {
                    health: '/health',
                    websocket: '/socket.io',
                    api: `/api/${version}`
                }
            });
        } catch (error) {
            res.status(500).json({
                error: 'Internal Server Error',
                message: 'Failed to retrieve API documentation'
            });
        }
    }
};

// Initialize versioning system
ApiVersioningService.initializeVersions();