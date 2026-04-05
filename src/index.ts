import dotenv from "dotenv";
dotenv.config();
import express, { Express } from "express";
import mongoose from "mongoose";
import bodyParser from "body-parser";
import cors from "cors";
import cookieParser from "cookie-parser";
import authRouter from "./routes/authRouter";
import transactionRouter from "./routes/transactionRouter";
import budgetsRouter from "./routes/budgetsRouter";
import potsRouter from "./routes/potsRouter";

// Server settings
const server: Express = express();
const PORT = process.env.PORT || 8000;
server.set("json spaces", 2);
server.use(bodyParser.json());
server.use(cookieParser());
server.use(
  cors({
    credentials: true,
  }),
);

// Routes
server.use("/api", transactionRouter);
server.use("/api", budgetsRouter);
server.use("/api", potsRouter);
server.use("/api", authRouter);

// Running server
server.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s9jj6.mongodb.net/?appName=Cluster0`,
    {
      dbName: "finances",
    },
  );
});
