import express from "express";
import { initializeDB } from "./config/database"; // التأكد من الاسم الصحيح للدالة
import 'dotenv/config';
import authRoute from "./routes/Auth Routes/authRoutes";
import { errorHandler, notFound } from "./middlewares/httpErrors";

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(notFound);
app.use(errorHandler);

app.use("/api",authRoute);
app.listen(PORT, async () => {
  await initializeDB(); 
  console.log(`Server is running on http://localhost:${PORT}`);
});
