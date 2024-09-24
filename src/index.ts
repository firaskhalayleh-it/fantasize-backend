import express from "express";
import { initializeDB } from "./config/database"; // التأكد من الاسم الصحيح للدالة
import 'dotenv/config';
import cookieParser from 'cookie-parser';
import cors  from "cors";
import authRoute from "./routes/Auth Routes/authRoutes";
import { errorHandler, notFound } from "./middlewares/httpErrors";
import userRoute from "./routes/Users Routes/usersRoute";
import addressRoute from "./routes/Users Routes/addressRoute";

const app = express();
app.use(cookieParser());
app.use(cors());


const PORT = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use("/api",authRoute);
app.use("/api",userRoute);
app.use("/api",addressRoute);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, async () => {
  await initializeDB(); 
  console.log(`Server is running on http://localhost:${PORT}`);
});
