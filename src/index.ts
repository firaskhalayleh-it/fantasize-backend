import express from "express";
import session from 'express-session';
import passport from 'passport';
import { initializeDB } from "./config/database";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import path from 'path';
import cors from "cors";
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
import notificationRoute from "./routes/Notification Routes/notificationRoute";
import adminDashboardRoutes from "./routes/Admin Dashboard Rotue/adminDashbourdRoute";
import customizationRoute from "./routes/CustomizationRoute/customizationRoute";
import exploreRoute from "./routes/Explore Route/exploreRoute";
import { setupSwagger } from "./swagger/swagger";
import authGoogleFacebookRoute from "./routes/Auth Routes/authUsingFacebookGoogleRoutes";
import homeRoute from "./routes/Home Routes/home_route";
import './config/passportConfig';

import ip from 'ip';
const app = express();
const IP = ip.address();
app.use(cookieParser());
// app.use(cors());


const PORT = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(session({
  secret: 'secret-key',
  resave: false,
  saveUninitialized: true,
}));
app.use(passport.initialize());
app.use(passport.session());

app.use(cors({
  origin: '*',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true,
  allowedHeaders: ['Content-Type', 'Authorization', 'cookie'],


}));
setupSwagger(app);
app.use('/api', authGoogleFacebookRoute);
app.use('/resources', express.static(path.join(__dirname, '..', 'resources')));
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
app.use("/api", notificationRoute);
app.use("/api", customizationRoute);
app.use("/explore", exploreRoute);
app.use("/home", homeRoute);

app.use(notFound);
app.use(errorHandler);
app.use(validateUUIDParam);

app.listen(PORT, async () => {
  await initializeDB();
  console.log(`Server is running on http://${IP}:${PORT}`);
});
