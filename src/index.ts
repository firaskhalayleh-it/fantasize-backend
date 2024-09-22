import express from "express";
import { initlizeDB } from "./config/database";
import 'dotenv/config';




const app = express();
const PORT = process.env.APP_PORT || 3000;

app.use(express.json());

app.listen(PORT, () => {
  initlizeDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});