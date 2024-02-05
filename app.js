import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { admin_router } from "./router/adminRouter.js";
import { merchant_router } from "./router/merchantRouter.js";
import { connectToDatabase } from "./database/database.js";
import dotenv from "dotenv";

const app = express();
dotenv.config();
connectToDatabase();

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/api", admin_router);
app.use("/api", merchant_router);

app.listen(5001, () => {
  console.log(`server is running on port 5001....`);
});

export { express };
