import { Request, Response, NextFunction } from 'express';
import { validationResult, ValidationChain } from 'express-validator';
import DOMPurify from 'isomorphic-dompurify';
import helmet from 'helmet';

/**
 * Security middleware configuration
 */
export const securityMiddleware = [
    // Helmet for security headers
    helmet({
        contentSecurityPolicy: {
            directives: {
                defaultSrc: ["'self'"],
                styleSrc: ["'self'", "'unsafe-inline'"],
                scriptSrc: ["'self'"],
                imgSrc: ["'self'", "data:", "https:"],
                fontSrc: ["'self'", "https:", "data:"],
                connectSrc: ["'self'"],
                frameSrc: ["'none'"],
                objectSrc: ["'none'"],
                mediaSrc: ["'self'"],
                manifestSrc: ["'self'"]
            }
        },
        crossOriginEmbedderPolicy: false,
        hsts: {
            maxAge: 31536000,
            includeSubDomains: true,
            preload: true
        }
    }),

    // Custom security headers
    (req: Request, res: Response, next: NextFunction) => {
        res.setHeader('X-Frame-Options', 'DENY');
        res.setHeader('X-Content-Type-Options', 'nosniff');
        res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
        res.setHeader('Permissions-Policy', 'geolocation=(), camera=(), microphone=()');
        next();
    }
];

/**
 * Input sanitization middleware
 */
export const sanitizeInput = (req: Request, res: Response, next: NextFunction) => {
    // Sanitize request body
    if (req.body) {
        req.body = sanitizeObject(req.body);
    }

    // Sanitize query parameters
    if (req.query) {
        req.query = sanitizeObject(req.query);
    }

    // Sanitize URL parameters
    if (req.params) {
        req.params = sanitizeObject(req.params);
    }

    next();
};

/**
 * Recursively sanitize an object
 */
function sanitizeObject(obj: any): any {
    if (typeof obj === 'string') {
        return DOMPurify.sanitize(obj, { ALLOWED_TAGS: [], ALLOWED_ATTR: [] });
    }

    if (Array.isArray(obj)) {
        return obj.map(item => sanitizeObject(item));
    }

    if (obj && typeof obj === 'object') {
        const sanitized: any = {};
        for (const [key, value] of Object.entries(obj)) {
            sanitized[key] = sanitizeObject(value);
        }
        return sanitized;
    }

    return obj;
}

/**
 * SQL injection protection patterns
 */
const SQL_INJECTION_PATTERNS = [
    /('|(\\')|(;)|(\\;)|(\\)|(\\\)))/i,
    /((\%27)|(\'))/i,
    /((\%3D)|(=))[^\n]*((\%27)|(\')|((\%3B)|(;)))/i,
    /\w*((\%27)|(\'))((\%6F)|o|(\%4F))((\%72)|r|(\%52))/i,
    /((\%27)|(\'))union/i,
    /exec(\s|\+)+(s|x)p\w+/i,
    /UNION(?:\s+ALL)?\s+SELECT/i,
    /INSERT(?:\s+INTO)?\s+\w+/i,
    /UPDATE\s+\w+\s+SET/i,
    /DELETE\s+FROM\s+\w+/i,
    /DROP\s+(TABLE|DATABASE)\s+\w+/i,
    /CREATE\s+(TABLE|DATABASE)\s+\w+/i,
    /ALTER\s+TABLE\s+\w+/i,
    /TRUNCATE\s+TABLE\s+\w+/i
];

/**
 * SQL injection detection middleware
 */
export const sqlInjectionProtection = (req: Request, res: Response, next: NextFunction) => {
    const checkValue = (value: string): boolean => {
        return SQL_INJECTION_PATTERNS.some(pattern => pattern.test(value));
    };

    const checkObject = (obj: any): boolean => {
        if (typeof obj === 'string') {
            return checkValue(obj);
        }

        if (Array.isArray(obj)) {
            return obj.some(item => checkObject(item));
        }

        if (obj && typeof obj === 'object') {
            return Object.values(obj).some(value => checkObject(value));
        }

        return false;
    };

    // Check body, query, and params
    const sources = [req.body, req.query, req.params];
    const hasSQLInjection = sources.some(source => source && checkObject(source));

    if (hasSQLInjection) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Invalid input detected'
        });
    }

    next();
};

/**
 * XSS protection middleware
 */
export const xssProtection = (req: Request, res: Response, next: NextFunction) => {
    const XSS_PATTERNS = [
        /<script[^>]*>[\s\S]*?<\/script>/gi,
        /<iframe[^>]*>[\s\S]*?<\/iframe>/gi,
        /<object[^>]*>[\s\S]*?<\/object>/gi,
        /<embed[^>]*>[\s\S]*?<\/embed>/gi,
        /<applet[^>]*>[\s\S]*?<\/applet>/gi,
        /<meta[^>]*>/gi,
        /<link[^>]*>/gi,
        /javascript:/gi,
        /vbscript:/gi,
        /onload=/gi,
        /onerror=/gi,
        /onclick=/gi,
        /onmouseover=/gi,
        /onfocus=/gi,
        /onblur=/gi,
        /onchange=/gi,
        /onsubmit=/gi
    ];

    const checkValue = (value: string): boolean => {
        return XSS_PATTERNS.some(pattern => pattern.test(value));
    };

    const checkObject = (obj: any): boolean => {
        if (typeof obj === 'string') {
            return checkValue(obj);
        }

        if (Array.isArray(obj)) {
            return obj.some(item => checkObject(item));
        }

        if (obj && typeof obj === 'object') {
            return Object.values(obj).some(value => checkObject(value));
        }

        return false;
    };

    // Check body, query, and params
    const sources = [req.body, req.query, req.params];
    const hasXSS = sources.some(source => source && checkObject(source));

    if (hasXSS) {
        return res.status(400).json({
            error: 'Bad Request',
            message: 'Invalid input detected'
        });
    }

    next();
};

/**
 * Request size limit middleware
 */
export const requestSizeLimit = (maxSize: number = 1024 * 1024) => { // 1MB default
    return (req: Request, res: Response, next: NextFunction) => {
        const contentLength = parseInt(req.headers['content-length'] || '0', 10);
        
        if (contentLength > maxSize) {
            return res.status(413).json({
                error: 'Payload Too Large',
                message: `Request size exceeds maximum allowed size of ${maxSize} bytes`
            });
        }

        next();
    };
};

/**
 * Validation middleware using express-validator
 */
export const validate = (validations: ValidationChain[]) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        // Run all validations
        await Promise.all(validations.map(validation => validation.run(req)));

        // Check for validation errors
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({
                error: 'Validation Error',
                message: 'Invalid input data',
                details: errors.array()
            });
        }

        next();
    };
};

/**
 * File upload security middleware
 */
export const fileUploadSecurity = (req: Request, res: Response, next: NextFunction) => {
    if (!req.file && !req.files) {
        return next();
    }

    const dangerousExtensions = [
        '.exe', '.bat', '.cmd', '.scr', '.com', '.pif', '.vbs', '.js', '.jar',
        '.php', '.asp', '.aspx', '.jsp', '.pl', '.py', '.rb', '.sh', '.ps1'
    ];

    const allowedMimeTypes = [
        'image/jpeg', 'image/png', 'image/gif', 'image/webp', 'image/svg+xml',
        'application/pdf', 'text/plain', 'text/csv',
        'application/msword', 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
        'application/vnd.ms-excel', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet'
    ];

    const files = req.files ? (Array.isArray(req.files) ? req.files : Object.values(req.files).flat()) : [req.file];

    for (const file of files) {
        if (!file) continue;

        // Check file extension
        const fileExtension = file.originalname.toLowerCase().substring(file.originalname.lastIndexOf('.'));
        if (dangerousExtensions.includes(fileExtension)) {
            return res.status(400).json({
                error: 'Invalid File Type',
                message: 'File type not allowed'
            });
        }

        // Check MIME type
        if (!allowedMimeTypes.includes(file.mimetype)) {
            return res.status(400).json({
                error: 'Invalid File Type',
                message: 'File MIME type not allowed'
            });
        }

        // Check file size (50MB max)
        if (file.size > 50 * 1024 * 1024) {
            return res.status(400).json({
                error: 'File Too Large',
                message: 'File size exceeds 50MB limit'
            });
        }
    }

    next();
};

/**
 * IP whitelist middleware
 */
export const ipWhitelist = (allowedIPs: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const clientIP = req.ip || req.connection.remoteAddress || 'unknown';
        
        if (!allowedIPs.includes(clientIP)) {
            return res.status(403).json({
                error: 'Forbidden',
                message: 'Access denied from this IP address'
            });
        }

        next();
    };
};

/**
 * API key validation middleware
 */
export const apiKeyValidation = (req: Request, res: Response, next: NextFunction) => {
    const apiKey = req.headers['x-api-key'] as string;
    const validApiKeys = process.env.API_KEYS?.split(',') || [];

    if (!apiKey || !validApiKeys.includes(apiKey)) {
        return res.status(401).json({
            error: 'Unauthorized',
            message: 'Invalid or missing API key'
        });
    }

    next();
};