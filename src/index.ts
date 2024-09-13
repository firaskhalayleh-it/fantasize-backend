import express from "express";
import { initlizeDB } from "./config/database";
import 'dotenv/config';
import authRouter from "./routes/auth_route";
import cookieParser from 'cookie-parser';
import favRouter from "./routes/favorites_route";




const authr = authRouter;
const favr = favRouter;
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());
app.use(authr);
app.use(favr);

app.listen(PORT, () => {
    initlizeDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});