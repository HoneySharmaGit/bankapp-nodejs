import express from "express";
import bodyParser from "body-parser";
import cors from "cors";
import { admin_router } from "./src/router/adminRouter.js";
import { merchant_router } from "./src/router/merchantRouter.js";
import { connectToDatabase } from "./src/database/database.js";
import dotenv from "dotenv";

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cors());

app.use("/api", admin_router);
app.use("/api", merchant_router);

async function startServer() {
  try {
    await connectToDatabase();
    app.listen(port, () => {
      console.log(`Server is running on port ${port}....`);
    });
  } catch (error) {
    console.error("Error starting server:", error);
  }
}

startServer();

export { express };
