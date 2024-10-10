import express from "express";
import { initializeDB } from "./config/database";
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors from "cors";
import authRoute from "./routes/Auth Routes/authRoutes";
import { errorHandler, notFound } from "./middlewares/httpErrors";
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


const app = express();
app.use(cookieParser());
app.use(cors());


const PORT = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

setupSwagger(app);
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


app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
  await initializeDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});
