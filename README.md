# Fantasize Backend Project

## Project Overview
The **Fantasize Backend** is the server-side component of the Fantasize platform, designed to manage and serve data for a dynamic, feature-rich application. Built using modern development practices and robust technologies, the backend ensures a scalable, secure, and efficient foundation for the platform.

---

## Key Features

### 1. **User Management**
- Secure user registration and login system.
- Support for third-party authentication (e.g., Google, Facebook).
- Role-based access control for administrators and users.

### 2. **Customization Management**
- Dynamic customization system to handle various product options.
- Customization options stored in a JSONB format for flexibility and performance.
- Supports multiple types such as:
  - **Buttons** with selectable options.
  - **Images** with file uploads.
  - **Text** and **Messages**.

### 3. **Product & Package Management**
- Comprehensive CRUD operations for managing products and packages.
- Association of customizations with products and packages for tailored user experiences.

### 4. **Order Management**
- Create, read, update, and delete orders.
- Relationships between orders, products, and packages for seamless operations.

### 5. **Notification System**
- Support for push notifications and email notifications.
- Notification templates stored as JSONB objects for reusability.

---

## Technical Stack

### **Primary Technologies**
- **Node.js** with **TypeScript**: Ensures strong typing and maintainable codebase.
- **Express.js**: Fast and minimalist web framework for building RESTful APIs.
- **PostgreSQL**: Reliable relational database with JSONB support for dynamic data storage.
- **TypeORM**: Object-Relational Mapping (ORM) for seamless database interactions.

### **Supporting Tools**
- **Multer**: File handling middleware for image and video uploads.
- **PM2**: Process manager for efficient deployment and scaling.
- **GitHub**: Version control and collaboration through [GitHub Repository](https://github.com/firaskhalayleh-it/fantasize-backend).

---

## API Endpoints

### **User Routes**
- `POST /users/register` - Register a new user.
- `POST /users/login` - Authenticate a user.

### **Customization Routes**
- `POST /customizations` - Create a new customization.
- `GET /customizations/:id` - Retrieve customization details.
- `PUT /customizations/:id` - Update an existing customization.
- `DELETE /customizations/:id` - Remove a customization.

### **Order Routes**
- `POST /orders` - Place a new order.
- `GET /orders` - Retrieve all user orders.

---

## Code Structure

