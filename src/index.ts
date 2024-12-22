import express from "express";
import session from 'express-session';
import passport from 'passport';
import { initializeDB } from "./config/database";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from "cors";
import ip from 'ip';
import cluster from 'cluster';
import { clusterConfig } from './config/cluster.config';
import authRoute from "./routes/Auth Routes/authRoutes";
import { errorHandler, notFound, validateUUIDParam } from "./middlewares/httpErrors";
import userRoute from "./routes/Users Routes/usersRoute";
import addressRoute from "./routes/Users Routes/addressRoute";
import paymentMethodRoute from "./routes/Payment methods Routes/paymentMethodsRoute";
import categoryRoute from "./routes/Categories Routes/categoriesRoute";
import packageRoute from "./routes/Packages Routes/packagesRoutes";
import productRoute from "./routes/Products Routes/productRoutes";
import { userFaves } from "./routes/Products Routes/favoriteProductsRoutes";
import orderProductRoute from "./routes/Products Routes/ordersProductsRoutes";
import favoritePackagesRoute from "./routes/Packages Routes/favoritePackagesRoutes";
import brandRoute from "./routes/Brands Routes/BrandsRoutes";
import orderPackageRoute from "./routes/Packages Routes/ordersPackagesRoutes";
import reviewsRoute from "./routes/Reviews Routes/reviewsRoutes";
import offerRoute from "./routes/Offers Routes/offersRoutes";
import orderRoute from "./routes/Order Routes/orderRoute";
import adminDashboardRoutes from "./routes/Admin Dashboard Rotue/adminDashbourdRoute";
import customizationRoute from "./routes/CustomizationRoute/customizationRoute";
import exploreRoute from "./routes/Explore Route/exploreRoute";
import { setupSwagger } from "./swagger/swagger";
import authGoogleFacebookRoute from "./routes/Auth Routes/authUsingFacebookGoogleRoutes";
import materialRoutes from "./routes/Material Route/MaterialRoute";
import homeRoute from "./routes/Home Routes/home_route";
import searchRoute from "./routes/search Route/searchRoute";
import notificationRoute from "./routes/Notification Routes/notificationRoute";
import generaroute from "./routes/general Routes/generalRoute";
import './config/passportConfig';

async function startServer() {
    const app = express();
    const { server, cors: corsConfig } = clusterConfig;

    // Request logging middleware
    app.use((req, res, next) => {
        console.log(`[Worker ${process.pid}] ${req.method} ${req.url}`);
        next();
    });

    // Basic middleware
    app.use(cookieParser());
    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));

    // Passport initialization
    app.use(passport.initialize());

    // CORS configuration
    app.use(cors(corsConfig));

    // Instance info endpoint for testing
    app.get('/instance-info', (req, res) => {
        res.json({
            pid: process.pid,
            workerId: cluster.worker?.id || 'N/A',
            timestamp: new Date().toISOString(),
            // Note: ip.address() is your local IP; if you're behind NAT, 
            // this won't be your public IP.
            serverAddress: `http://${ip.address()}:${server.port}`,
            clientIP: req.ip,
            uptime: process.uptime()
        });
    });

    // Setup Swagger docs
    setupSwagger(app);

    // Static files
    app.use('/resources', express.static(path.join(__dirname, '..', 'resources')));

    // Routes
    app.use('/api', authGoogleFacebookRoute);
    app.use("/api", authRoute);
    app.use("/api", userRoute);
    app.use("/api", addressRoute);
    app.use("/api", paymentMethodRoute);
    app.use("/api", categoryRoute);
    app.use("/api", productRoute);
    app.use("/api", userFaves);
    app.use("/api", orderProductRoute);
    app.use("/api", packageRoute);
    app.use("/api", orderPackageRoute);
    app.use("/api", favoritePackagesRoute);
    app.use("/api", brandRoute);
    app.use("/api", reviewsRoute);
    app.use("/api", offerRoute);
    app.use("/api", orderRoute);
    app.use("/api", adminDashboardRoutes);
    app.use("/api", customizationRoute);
    app.use("/explore", exploreRoute);
    app.use("/material", materialRoutes);
    app.use("/home", homeRoute);
    app.use("/search", searchRoute);
    app.use("/general", generaroute);
    app.use("/notifications", notificationRoute);

    // Error handling middleware
    app.use(notFound);
    app.use(errorHandler);
    app.use(validateUUIDParam);

    try {
        // Initialize database
        await initializeDB().then(() => {
            console.log('Database connection successful');
        });
        
        // IMPORTANT: Listen on 0.0.0.0 so it can be reached from any network
        app.listen(server.port, server.host, () => {
            console.log(
                `Worker ${process.pid} is running on http://${ip.address()}:${server.port}`
            );
            console.log(
                `Express server is bound to ${server.host} (all interfaces).`
            );
        });
    } catch (error) {
        console.error('Failed to start server:', error);
        process.exit(1);
    }
}

// If this module is run directly (not imported), start the server
if (require.main === module) {
    startServer().catch(error => {
        console.error('Failed to start server:', error);
        process.exit(1);
    });
}

export default startServer;
