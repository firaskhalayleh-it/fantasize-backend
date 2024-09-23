import express from "express";
import { initializeDB } from "./config/database"; // التأكد من الاسم الصحيح للدالة
import 'dotenv/config';

const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(express.json());

app.listen(PORT, async () => {
  await initializeDB(); 
  console.log(`Server is running on http://localhost:${PORT}`);
});
