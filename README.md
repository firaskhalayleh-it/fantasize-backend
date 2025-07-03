# Fantasize Backend Project

## Project Overview

The **Fantasize Backend** is a production-ready, enterprise-grade e-commerce platform backend built with modern technologies and best practices. This server-side application handles all business logic for the Fantasize platform, including user management, product customization, order processing, real-time features, and comprehensive monitoring.

The project features a modular architecture with advanced capabilities like Redis caching, WebSocket real-time communications, API versioning, performance monitoring, and enterprise-level security.

---

## 🚀 Key Features

### 1. **User Management**
- **Secure Authentication**:
  - JWT (JSON Web Tokens) for stateless authentication
  - Password encryption using `bcrypt` with configurable salt rounds
  - Multi-factor authentication support
- **Third-Party Integrations**:
  - OAuth 2.0 for Google and Facebook login
  - Social media profile integration
- **User Roles and Permissions**:
  - Role-based access control (RBAC) for administrators, managers, and customers
  - Fine-grained permission system

### 2. **Product & Package Management**
- **CRUD Operations**:
  - Products with attributes like name, price, description, stock, and media
  - Packages containing multiple products with bundling logic
  - Advanced filtering, sorting, and pagination
- **Association Management**:
  - Products and packages with customizations
  - Category and subcategory hierarchies
  - Brand and material associations

### 3. **Dynamic Customization Management**
- **Flexible Customization Options**:
  - **Button** options with predefined values
  - **Image** options with file uploads and validation
  - **Text** fields for personalized messages
  - Customization data stored in `JSONB` for flexible querying
- **Advanced Features**:
  - Special customization workflows with admin approval
  - Customization templates and presets
  - Real-time customization preview

### 4. **Order Management**
- **Complete Order Lifecycle**:
  - Order creation with product and package details
  - Status tracking (Pending, Processed, Shipped, Delivered)
  - Inventory management with automatic deduction
  - Special customization handling with admin review
- **Advanced Features**:
  - Real-time order tracking via WebSocket
  - Order notifications and status updates
  - Gift orders and anonymous purchasing

### 5. **Real-time Features** 🆕
- **WebSocket Integration**:
  - Socket.IO implementation with authentication
  - Real-time order status updates
  - Live inventory change notifications
  - System announcements and alerts
- **Room-based Messaging**:
  - User-specific rooms for notifications
  - Order tracking rooms for live updates
  - Admin broadcast capabilities

### 6. **Performance & Caching** 🆕
- **Redis Caching Layer**:
  - Intelligent caching with configurable TTL
  - Cache invalidation patterns
  - Multi-level caching strategy
- **Performance Monitoring**:
  - Real-time request tracking
  - Slow query detection
  - Memory usage monitoring
  - Performance metrics aggregation

### 7. **Security Enhancements** 🆕
- **Input Protection**:
  - XSS protection with DOMPurify
  - SQL injection prevention
  - Request sanitization middleware
- **API Security**:
  - Rate limiting with Redis backend
  - Security headers via Helmet
  - File upload validation
  - API key authentication

### 8. **API Versioning & Standards** 🆕
- **Version Management**:
  - Support for multiple API versions (v0, v1, v2)
  - Deprecation warnings and sunset headers
  - Backwards compatibility
- **Response Standardization**:
  - Consistent API response format
  - Request IDs and metadata
  - Structured error handling

### 9. **Health & Monitoring** 🆕
- **Comprehensive Health Checks**:
  - Database connectivity monitoring
  - Redis health verification
  - Memory and system resource checks
- **DevOps Integration**:
  - Kubernetes-ready health endpoints
  - Performance metrics for monitoring tools
  - Structured logging

### 10. **Admin Dashboard Support**
- **Management APIs**:
  - User, product, package, and customization management
  - System reports and analytics
  - Performance monitoring dashboard
- **Data Export**:
  - CSV, Excel export capabilities
  - Advanced filtering and reporting

---

## 🏗️ Technical Stack

### **Backend Framework**
- **Node.js** with **TypeScript** for type safety and maintainability
- **Express.js** for lightweight, fast API development
- **Socket.IO** for real-time WebSocket communications

### **Database & Caching**
- **PostgreSQL** with `JSONB` support for flexible data storage
- **TypeORM** for database abstraction and migrations
- **Redis** for caching, rate limiting, and session management

### **Security & Performance**
- **Helmet** for security headers and CSP
- **bcrypt** for password encryption
- **DOMPurify** for XSS prevention
- **Express Rate Limit** with Redis backend

### **File Management & Media**
- **Multer** for file upload handling
- **File validation** for security and type checking
- **Static file serving** with optimized caching

### **External Integrations**
- **Firebase** for push notifications and authentication
- **Nodemailer** for email notifications
- **Passport** for OAuth integrations

### **DevOps & Monitoring**
- **PM2** for process management and clustering
- **Winston** for structured logging
- **Custom health checks** for monitoring integration

---

## 🔧 API Endpoints

### **Authentication & Users**
```bash
POST /api/auth/register          # User registration
POST /api/auth/login             # User authentication
POST /api/auth/google           # Google OAuth login
POST /api/auth/facebook         # Facebook OAuth login
GET  /api/users/profile         # User profile
PUT  /api/users/profile         # Update profile
```

### **Product Management**
```bash
GET    /api/products                    # List all products (cached)
GET    /api/products/:id               # Get product details (cached)
POST   /api/products                   # Create product (admin)
PUT    /api/products/:id               # Update product (admin)
DELETE /api/products/:id               # Delete product (admin)
GET    /api/products/category/:id      # Products by category (cached)
```

### **Order Management**
```bash
GET    /api/orders                     # User orders
POST   /api/orders                     # Create order
PUT    /api/orders/:id/status          # Update order status (admin)
GET    /api/orders/:id/track           # Order tracking
POST   /api/orders/:id/checkout        # Checkout order
```

### **Real-time Features** 🆕
```bash
GET    /api/realtime/connection-status    # WebSocket status (admin)
POST   /api/realtime/test-notification    # Send test notification (admin)
POST   /api/realtime/broadcast-announcement # Broadcast message (admin)
GET    /api/realtime/user-connection/:id  # Check user connection (admin)
```

### **Performance Monitoring** 🆕
```bash
GET    /api/admin/performance/metrics      # Performance metrics (admin)
GET    /api/admin/performance/slow-requests # Slow request analysis (admin)
GET    /api/admin/performance/summary      # Performance summary (admin)
```

### **Health & System**
```bash
GET    /health                         # Comprehensive health check
GET    /health/ready                   # Readiness probe
GET    /health/live                    # Liveness probe
GET    /instance-info                  # Instance information
```

---

## 🚀 Quick Start

### Prerequisites
- Node.js 18+ and npm
- PostgreSQL 13+
- Redis 6+
- Git

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/firaskhalayleh-it/fantasize-backend.git
   cd fantasize-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Environment setup**
   ```bash
   cp .env.example .env
   # Edit .env with your configuration
   ```

4. **Database setup**
   ```bash
   # Create PostgreSQL database
   createdb fantasize_db
   
   # Start Redis
   redis-server
   ```

5. **Start the development server**
   ```bash
   npm run dev
   ```

6. **Production build**
   ```bash
   npm run build
   npm run prod
   ```

### Environment Configuration

Create a `.env` file with the following variables:

```bash
# Database
DATABASE_HOST=localhost
DATABASE_PORT=5432
DATABASE_USER=postgres
DATABASE_PASSWORD=your_password
DATABASE_NAME=fantasize_db

# Redis
REDIS_HOST=localhost
REDIS_PORT=6379
REDIS_PASSWORD=

# Security
JWT_SECRET=your_jwt_secret
API_KEYS=api_key_1,api_key_2

# Server
NODE_ENV=development
APP_PORT=5000
HOST=0.0.0.0
CORS_ORIGIN=http://localhost:3000

# Performance
ENABLE_PERFORMANCE_MONITORING=true
SLOW_REQUEST_THRESHOLD=1000

# Rate Limiting
RATE_LIMIT_WINDOW_MS=900000
RATE_LIMIT_MAX_REQUESTS=100
```

---

## 🔄 Real-time WebSocket Usage

### Client Connection
```javascript
import io from 'socket.io-client';

const socket = io('ws://localhost:5000');

// Authenticate
socket.emit('authenticate', 'your_jwt_token');

socket.on('authenticated', (data) => {
    console.log('Connected:', data);
});
```

### Order Tracking
```javascript
// Subscribe to order updates
socket.emit('track_order', 'order123');

// Listen for status updates
socket.on('order_status_update', (update) => {
    console.log('Order updated:', update);
});
```

### Real-time Notifications
```javascript
// Listen for notifications
socket.on('real_time_notification', (notification) => {
    displayNotification(notification.title, notification.message);
});
```

---

## 📊 Performance Features

### Caching Strategy
- **Product Data**: 10-minute cache with automatic invalidation
- **Categories**: 30-minute cache for stable data
- **User Sessions**: Redis-backed session management
- **API Responses**: Configurable TTL based on data volatility

### Rate Limiting
- **General API**: 100 requests per 15 minutes
- **Authentication**: 5 attempts per 15 minutes
- **File Uploads**: 10 uploads per hour
- **Admin Operations**: 50 requests per 5 minutes

### Monitoring
- **Response Time Tracking**: All API endpoints monitored
- **Error Rate Analysis**: Real-time error tracking
- **Memory Usage**: System resource monitoring
- **Slow Query Detection**: Automatic identification of performance issues

---

## 🔒 Security Features

### Input Protection
- **XSS Prevention**: DOMPurify sanitization
- **SQL Injection Protection**: Pattern-based detection
- **File Upload Security**: MIME type and size validation
- **Request Validation**: Express-validator integration

### API Security
- **Rate Limiting**: Redis-backed protection
- **Security Headers**: Helmet middleware
- **CORS Configuration**: Configurable origin policies
- **API Key Authentication**: Multi-key support

---

## 🏥 Health Monitoring

### Health Check Endpoints
```bash
# Comprehensive health check
curl http://localhost:5000/health

# Readiness check (for load balancers)
curl http://localhost:5000/health/ready

# Liveness check (for Kubernetes)
curl http://localhost:5000/health/live
```

### Monitoring Integration
- **Prometheus**: Metrics endpoint available
- **Grafana**: Dashboard templates included
- **Docker Health Checks**: Container-ready endpoints
- **Kubernetes Probes**: Ready for orchestration

---

## 🔢 API Versioning

### Version Specification
```bash
# Header-based versioning
curl -H "API-Version: v2" http://localhost:5000/api/products

# URL-based versioning  
curl http://localhost:5000/api/v2/products

# Query parameter versioning
curl http://localhost:5000/api/products?version=v2
```

### Supported Versions
- **v2**: Current version with all features
- **v1**: Stable version for existing integrations
- **v0**: Deprecated (support ends 2024-12-31)

---

## 📁 Project Structure

```
fantasize-backend/
├── src/
│   ├── config/              # Configuration files
│   │   ├── database.ts      # Database connection
│   │   ├── redis.ts         # Redis configuration
│   │   └── firebase-config.ts
│   ├── entities/            # TypeORM entities
│   │   ├── users/          # User-related entities
│   │   ├── products/       # Product entities
│   │   └── packages/       # Package entities
│   ├── middlewares/         # Express middlewares
│   │   ├── cacheMiddleware.ts      # Redis caching
│   │   ├── rateLimitMiddleware.ts  # Rate limiting
│   │   ├── securityMiddleware.ts   # Security features
│   │   └── versioningMiddleware.ts # API versioning
│   ├── services/            # Business logic
│   │   ├── Auth Services/
│   │   ├── Product Services/
│   │   ├── Order Services/
│   │   ├── Real-time Services/     # WebSocket services
│   │   ├── Performance Services/   # Monitoring
│   │   └── Health Services/        # Health checks
│   ├── routes/              # API routes
│   │   ├── Auth Routes/
│   │   ├── Products Routes/
│   │   ├── Real-time Routes/       # WebSocket endpoints
│   │   └── Health Routes/          # Health endpoints
│   ├── controllers/         # Request handlers
│   ├── utils/              # Utility functions
│   └── swagger/            # API documentation
├── resources/              # Static files
├── logs/                  # Application logs
├── .env.example           # Environment template
├── ENHANCEMENT_GUIDE.md   # Detailed feature guide
└── README.md             # This file
```

---

## 🚀 Deployment

### Docker Deployment
```bash
# Build the application
docker build -t fantasize-backend .

# Run with docker-compose
docker-compose up -d
```

### Production Considerations
- **Environment Variables**: Secure configuration management
- **SSL/TLS**: HTTPS configuration required
- **Load Balancing**: Sticky sessions for WebSocket
- **Monitoring**: Health check integration
- **Scaling**: Horizontal scaling support with Redis

---

## 🔧 Development

### Development Scripts
```bash
npm run dev          # Development with nodemon
npm run build        # TypeScript compilation
npm run start        # Production mode
npm run test         # Run tests (when available)
```

### Code Quality
- **TypeScript**: Full type safety
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting
- **Husky**: Git hooks for quality

---

## 📖 Documentation

- **API Documentation**: Available at `/api-docs` when running
- **Enhancement Guide**: See `ENHANCEMENT_GUIDE.md` for detailed feature documentation
- **WebSocket Events**: Real-time communication documentation
- **Performance Guide**: Optimization and monitoring best practices

---

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Implement your changes
4. Add tests and documentation
5. Submit a pull request

---

## 📝 License

This project is licensed under the ISC License.

---

## 📞 Support

For questions, issues, or feature requests:
- **GitHub Issues**: [Repository Issues](https://github.com/firaskhalayleh-it/fantasize-backend/issues)
- **Documentation**: See `ENHANCEMENT_GUIDE.md` for detailed information
- **API Documentation**: Available at `/api-docs` endpoint

---

**Built with ❤️ by the Fantasize Team**

*The Fantasize Backend - A production-ready, enterprise-grade e-commerce platform with modern DevOps practices and real-time capabilities.*

---

## Key Features

### 1. **User Management**
- **Secure Authentication**:
  - Implements JWT (JSON Web Tokens) for stateless authentication.
  - Password encryption using `bcrypt` to ensure data security.
- **Third-Party Integrations**:
  - Supports OAuth 2.0 for Google and Facebook login.
- **User Roles and Permissions**:
  - Role-based access control (RBAC) for administrators, managers, and customers.

### 2. **Product & Package Management**
- CRUD operations for managing:
  - Products with attributes like name, price, description, and stock.
  - Packages containing multiple products.
- Association of products and packages with customizations for tailored offerings.
- Advanced filtering and sorting capabilities for easier product management.

### 3. **Dynamic Customization Management**
- **Customizable Options**:
  - Supports multiple customization types:
    - **Button** options with predefined values.
    - **Image** options with file uploads.
    - **Text** fields for personalized messages.
  - Customization data stored in a `JSONB` column for flexible querying and storage.
- **API for Customization**:
  - Add, update, and delete customizations dynamically.
  - Retrieve customization options associated with specific products or packages.

### 4. **Order Management**
- End-to-end order lifecycle management:
  - Place new orders with product and package details.
  - Update order status (e.g., Pending, Processed, Delivered).
  - Retrieve all user orders with product/package relationships.
- Integration with a payment system (to be implemented).

### 5. **Notification System**
- **Push Notifications**:
  - Sends real-time notifications to mobile devices via Firebase.
- **Email Notifications**:
  - Configurable email templates stored as `JSONB` objects.
  - Email notifications triggered on events like order confirmation, shipping updates, etc.

### 6. **Admin Dashboard Support**
- APIs to power an admin dashboard for:
  - Managing users, products, packages, and customizations.
  - Viewing system reports and logs for analysis.
- Support for exporting data (e.g., CSV, Excel) for analytics.

### 7. **Performance Optimizations**
- Optimized query handling with TypeORM for high performance.
- Caching frequently accessed data to reduce database load.
- Efficient handling of file uploads using `Multer`.

---

## Technical Stack

### **Backend Framework**
- **Node.js** with **TypeScript**:
  - Provides a strongly typed, maintainable codebase.
- **Express.js**:
  - Lightweight, fast, and minimalist framework for building APIs.

### **Database**
- **PostgreSQL**:
  - Relational database with `JSONB` support for dynamic and semi-structured data.
- **TypeORM**:
  - ORM for seamless interaction with the PostgreSQL database.

### **Third-Party Tools**
- **Multer**:
  - Middleware for handling file uploads.
- **Firebase**:
  - Push notifications and third-party authentication.
- **PM2**:
  - Process manager for application deployment and scaling.

---

## API Endpoints

### **User Management**
- `POST /users/register` - Register a new user.
- `POST /users/login` - Authenticate a user.
- `GET /users/profile` - Retrieve user profile details.

### **Product Management**
- `GET /products` - Retrieve a list of all products.
- `POST /products` - Add a new product.
- `PUT /products/:id` - Update product details.
- `DELETE /products/:id` - Delete a product.

### **Customization Management**
- `POST /customizations` - Create a new customization.
- `GET /customizations/:id` - Retrieve customization details.
- `PUT /customizations/:id` - Update customization options.
- `DELETE /customizations/:id` - Remove a customization.

### **Order Management**
- `POST /orders` - Place a new order.
- `GET /orders` - List all user orders.
- `PUT /orders/:id` - Update an order’s status.

### **Notification Management**
- `POST /notifications` - Send a notification to a user.
- `GET /notifications` - Retrieve all notifications sent to a user.

---

## Code Structure

The project follows a modular architecture to ensure scalability and maintainability:

