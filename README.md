# Fantasize Backend Project

## Project Overview

The **Fantasize Backend** is the server-side backbone of the Fantasize platform, a dynamic application built to handle modern business needs such as e-commerce, product customization, and user interactions. This backend is developed using scalable and secure technologies, ensuring optimal performance and ease of maintenance. 

The project is structured with a modular architecture, designed to integrate seamlessly with the frontend and third-party services.

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

