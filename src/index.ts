import express from "express";
import { initlizeDB } from "./config/database";
import 'dotenv/config';
import router from "./routes/auth_route";




const authr = router;
const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(authr);

app.listen(PORT, () => {
    initlizeDB();
  console.log(`Server is running on http://localhost:${PORT}`);
});