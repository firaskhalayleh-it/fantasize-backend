# Fantasize Backend - Enhanced Features Documentation

## 🚀 Overview

The Fantasize Backend has been significantly enhanced with enterprise-grade features including real-time capabilities, advanced security, performance monitoring, and API versioning. This document provides comprehensive information about the new features and how to use them.

## 📋 Table of Contents

1. [Enhanced Features](#enhanced-features)
2. [Redis Caching System](#redis-caching-system)
3. [Rate Limiting](#rate-limiting)
4. [Security Enhancements](#security-enhancements)
5. [Real-time WebSocket Features](#real-time-websocket-features)
6. [Performance Monitoring](#performance-monitoring)
7. [Health Checks](#health-checks)
8. [API Versioning](#api-versioning)
9. [Configuration](#configuration)
10. [Usage Examples](#usage-examples)

## 🎯 Enhanced Features

### Performance & Scalability
- **Redis Caching**: Intelligent caching with TTL and invalidation
- **Rate Limiting**: Redis-backed rate limiting with different tiers
- **Database Optimization**: Connection pooling and query optimization
- **Performance Monitoring**: Real-time metrics and slow query detection

### Security
- **Input Sanitization**: XSS and SQL injection protection
- **Security Headers**: Helmet integration with CSP and HSTS
- **File Upload Security**: MIME type validation and size limits
- **API Key Authentication**: Multi-key support with IP whitelisting

### Real-time Features
- **WebSocket Support**: Socket.IO integration with authentication
- **Order Tracking**: Real-time order status updates
- **Inventory Updates**: Live inventory change notifications
- **System Announcements**: Broadcast messaging capabilities

### API & Integration
- **API Versioning**: Support for v0, v1, v2 with deprecation handling
- **Response Standardization**: Consistent API responses with metadata
- **Error Handling**: Structured error responses
- **Documentation**: Dynamic API documentation endpoints

## 🔄 Redis Caching System

### Features
- **Connection Management**: Automatic reconnection and connection pooling
- **TTL Support**: Configurable time-to-live for cached data
- **Cache Invalidation**: Pattern-based cache invalidation
- **Multiple Data Types**: Support for strings, objects, and complex data structures

### Configuration
```typescript
// Environment variables
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=your_redis_password

// Cache TTL settings
CACHE_TTL_PRODUCTS=600      // 10 minutes
CACHE_TTL_CATEGORIES=1800   // 30 minutes
CACHE_TTL_PACKAGES=600      // 10 minutes
CACHE_TTL_OFFERS=300        // 5 minutes
```

### Usage Example
```typescript
import { cacheMiddleware, cacheConfigs } from './middlewares/cacheMiddleware';

// Apply caching to routes
router.get('/products', cacheMiddleware(cacheConfigs.products), getProducts);
```

### Cache Invalidation
```typescript
import { invalidateCache, invalidationPatterns } from './middlewares/cacheMiddleware';

// Invalidate product cache when creating/updating products
router.post('/products', invalidateCache(invalidationPatterns.products), createProduct);
```

## 🛡️ Rate Limiting

### Features
- **Redis Backend**: Persistent rate limiting across instances
- **Multiple Configurations**: Different limits for different endpoints
- **User-based Limits**: Higher limits for authenticated users
- **Rate Limit Headers**: Informative headers for clients

### Rate Limit Configurations
```typescript
const rateLimitConfigs = {
    general: { windowMs: 15 * 60 * 1000, max: 100 },      // 100 requests per 15 minutes
    auth: { windowMs: 15 * 60 * 1000, max: 5 },           // 5 auth attempts per 15 minutes
    admin: { windowMs: 5 * 60 * 1000, max: 50 },          // 50 admin requests per 5 minutes
    upload: { windowMs: 60 * 60 * 1000, max: 10 },        // 10 uploads per hour
    order: { windowMs: 60 * 60 * 1000, max: 10 }          // 10 orders per hour
};
```

### Usage
```typescript
import { rateLimitMiddleware, rateLimitConfigs } from './middlewares/rateLimitMiddleware';

// Apply rate limiting
app.use('/api/auth', rateLimitMiddleware(rateLimitConfigs.auth));
app.use('/api/upload', rateLimitMiddleware(rateLimitConfigs.upload));
```

## 🔒 Security Enhancements

### Input Sanitization
```typescript
import { sanitizeInput, sqlInjectionProtection, xssProtection } from './middlewares/securityMiddleware';

app.use(sanitizeInput);           // Sanitize all input
app.use(sqlInjectionProtection);  // Prevent SQL injection
app.use(xssProtection);          // Prevent XSS attacks
```

### Security Headers
```typescript
import { securityMiddleware } from './middlewares/securityMiddleware';

app.use(securityMiddleware);     // Apply all security headers
```

### File Upload Security
```typescript
import { fileUploadSecurity } from './middlewares/securityMiddleware';

app.use('/upload', fileUploadSecurity);  // Validate file uploads
```

## 🔄 Real-time WebSocket Features

### Connection Setup
```javascript
// Client-side connection
const socket = io('ws://localhost:5000');

// Authenticate
socket.emit('authenticate', 'your-jwt-token');

socket.on('authenticated', (data) => {
    console.log('Authenticated:', data);
});
```

### Order Tracking
```javascript
// Subscribe to order updates
socket.emit('track_order', 'order123');

// Listen for order status updates
socket.on('order_status_update', (data) => {
    console.log('Order update:', data);
    // { orderId, status, details, timestamp }
});
```

### Inventory Monitoring
```javascript
// Subscribe to inventory updates
socket.emit('track_inventory', 'product456');

// Listen for inventory changes
socket.on('inventory_update', (data) => {
    console.log('Inventory update:', data);
    // { productId, quantity, details, timestamp }
});
```

### Real-time Notifications
```javascript
// Listen for notifications
socket.on('real_time_notification', (notification) => {
    console.log('Notification:', notification);
    // { title, message, type, timestamp }
});
```

### System Announcements
```javascript
// Listen for system announcements
socket.on('system_announcement', (announcement) => {
    console.log('System announcement:', announcement);
    // { title, message, type, timestamp }
});
```

## 📊 Performance Monitoring

### Features
- **Request Tracking**: Monitor all API requests and response times
- **Slow Query Detection**: Automatic detection of slow requests (>1s)
- **Memory Monitoring**: Track memory usage and detect leaks
- **Error Rate Tracking**: Monitor error rates and patterns

### Admin Endpoints
```bash
# Get performance metrics
GET /api/admin/performance/metrics?timeWindow=300000

# Get slow requests
GET /api/admin/performance/slow-requests?limit=10

# Get performance summary
GET /api/admin/performance/summary
```

### Response Example
```json
{
    "success": true,
    "data": {
        "last5Minutes": {
            "totalRequests": 150,
            "averageResponseTime": 85.5,
            "errorRate": 2.1,
            "slowRequests": 3,
            "requestsPerSecond": 0.5,
            "topEndpoints": [
                {
                    "endpoint": "GET /api/products",
                    "count": 45,
                    "averageResponseTime": 120.3
                }
            ]
        }
    }
}
```

## 🏥 Health Checks

### Endpoints
```bash
# Comprehensive health check
GET /health

# Readiness check (for load balancers)
GET /health/ready

# Liveness check (for container orchestration)
GET /health/live
```

### Health Check Response
```json
{
    "status": "healthy",
    "timestamp": "2024-01-01T12:00:00Z",
    "uptime": 3600000,
    "version": "1.0.0",
    "environment": "production",
    "checks": {
        "database": {
            "status": "healthy",
            "responseTime": 15.2,
            "message": "Database connection successful"
        },
        "redis": {
            "status": "healthy",
            "responseTime": 3.1,
            "message": "Redis connection successful"
        },
        "memory": {
            "status": "healthy",
            "responseTime": 0.5,
            "details": {
                "systemMemory": {
                    "usagePercent": 65.4
                }
            }
        }
    }
}
```

## 🔢 API Versioning

### Version Detection
The API supports multiple ways to specify the version:

1. **Header**: `API-Version: v2`
2. **URL Path**: `/api/v2/products`
3. **Query Parameter**: `?version=v2`

### Supported Versions
- **v2**: Current version with all latest features
- **v1**: Stable version with core features
- **v0**: Deprecated (support ends 2024-12-31)

### Deprecation Headers
```http
Deprecation: true
Sunset: 2024-12-31T23:59:59Z
Warning: 299 - "API v0 is deprecated. Please migrate to v1 or v2."
```

### Version-specific Handlers
```typescript
import { ApiVersioningService } from './middlewares/versioningMiddleware';

const versionedHandler = ApiVersioningService.versionHandler({
    v1: (req, res) => res.json({ version: 'v1', data: legacyData }),
    v2: (req, res) => res.json({ version: 'v2', data: enhancedData })
});

router.get('/products', versionedHandler);
```

## ⚙️ Configuration

### Environment Variables
```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=password
DATABASE_NAME=fantasize_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Security
JWT_SECRET=your-secret-key
API_KEYS=key1,key2,key3

# Performance
ENABLE_PERFORMANCE_MONITORING=true
SLOW_REQUEST_THRESHOLD=1000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100

# WebSocket
CORS_ORIGIN=http://localhost:3000

# Server
NODE_ENV=production
APP_PORT=5000
HOST=0.0.0.0
```

## 💡 Usage Examples

### Setting Up Caching
```typescript
// Apply caching to product routes
import { cacheMiddleware, cacheConfigs } from './middlewares/cacheMiddleware';

router.get('/products', 
    cacheMiddleware(cacheConfigs.products), 
    getAllProducts
);

// Custom cache configuration
router.get('/special-endpoint', 
    cacheMiddleware({ 
        ttl: 1800,           // 30 minutes
        keyPrefix: 'special',
        keyGenerator: (req) => `special:${req.params.id}:${req.query.filter}`
    }), 
    getSpecialData
);
```

### Real-time Order Updates
```typescript
// In your order service
import { EnhancedOrderService } from './services/Real-time Services/realTimeService';

// Update order status with real-time notification
await EnhancedOrderService.updateOrderStatus(
    orderId, 
    'shipped', 
    { trackingNumber: 'ABC123', estimatedDelivery: '2024-01-15' }
);
```

### Custom Rate Limiting
```typescript
// Create custom rate limiter for specific endpoint
const customRateLimit = rateLimitMiddleware({
    windowMs: 60 * 60 * 1000,  // 1 hour
    max: 5,                     // 5 requests per hour
    message: 'Too many password reset attempts',
    keyGenerator: (req) => `password_reset:${req.body.email}`
});

router.post('/forgot-password', customRateLimit, forgotPassword);
```

### WebSocket Integration
```typescript
// Send real-time notification to user
const webSocketService = (global as any).webSocketService;
if (webSocketService) {
    await webSocketService.sendRealTimeNotification(userId, {
        title: 'Order Confirmed',
        message: 'Your order has been confirmed and is being processed',
        type: 'success',
        data: { orderId: order.id }
    });
}
```

## 🔧 Best Practices

### Caching
- Use appropriate TTL values based on data volatility
- Implement cache warming for critical data
- Use cache invalidation patterns for data consistency
- Monitor cache hit rates and adjust configurations

### Rate Limiting
- Set different limits for different user tiers
- Use user-specific rate limiting for authenticated endpoints
- Implement graceful degradation when limits are exceeded
- Monitor rate limiting metrics to adjust thresholds

### Security
- Always validate and sanitize user input
- Use HTTPS in production
- Implement proper authentication and authorization
- Regular security audits and updates

### Real-time Features
- Implement proper authentication for WebSocket connections
- Use rooms for efficient message broadcasting
- Handle connection failures gracefully
- Implement rate limiting for WebSocket events

### Performance Monitoring
- Set up alerts for slow requests and high error rates
- Monitor memory usage and implement garbage collection strategies
- Use performance metrics to optimize bottlenecks
- Regular performance testing and optimization

## 🚀 Deployment Considerations

### Docker Configuration
```dockerfile
# Add Redis to your docker-compose.yml
services:
  redis:
    image: redis:7-alpine
    ports:
      - "6379:6379"
    volumes:
      - redis_data:/data
    command: redis-server --appendonly yes

volumes:
  redis_data:
```

### Load Balancer Configuration
```nginx
# Enable sticky sessions for WebSocket
upstream app_servers {
    ip_hash;  # For WebSocket session persistence
    server app1:5000;
    server app2:5000;
}

server {
    listen 80;
    
    location /socket.io/ {
        proxy_pass http://app_servers;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection "upgrade";
        proxy_set_header Host $host;
    }
    
    location /health {
        proxy_pass http://app_servers;
        access_log off;
    }
}
```

### Monitoring Setup
```yaml
# Prometheus configuration for metrics
scrape_configs:
  - job_name: 'fantasize-backend'
    static_configs:
      - targets: ['app:5000']
    metrics_path: '/metrics'
    scrape_interval: 30s
```

This comprehensive enhancement transforms the Fantasize Backend into a production-ready, enterprise-grade platform with modern DevOps practices, real-time capabilities, and robust monitoring systems.