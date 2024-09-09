import express from "express";
import { initlizeDB } from "./config/database";
import 'dotenv/config';

const app = express();
const PORT = process.env.PORT || 3000;

app.get("/", (req, res) => {
  res.send("Hello World!");
});

app.listen(PORT, () => {
    initlizeDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});