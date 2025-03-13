import express, { Express, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import cors from "cors";
import transactionRouter from "./routes/TransactionRoute";
import budgetRouter from "./routes/budgetRouter";
import potRouter from "./routes/potRouter";
import authRouter from "./routes/authRouter";
import sighUpRouter from "./routes/signUpRouter";
import userRouter from "./routes/UserRoute";
import { VerifyToken } from "./middleware";
import dbRouter from "./routes/dbRouter";
import tokenRouter from "./routes/tokenRouter";
import balanceRouter from "./routes/balanceRouter";

// Server settings
dotenv.config();
const server: Express = express();
const PORT = process.env.PORT || 8000;
server.set("json spaces", 2);
server.use(bodyParser.json());
server.use(cors());
const verifyToken = new VerifyToken();

// Main route
server.get("/", (__, res: Response) => {
  res.send(`
    <h1>Server</h1>
    <p>There will be API for personal finance application.</p>
  `);
});

// Routes
server.use("/api/transactions", verifyToken.userAccess, transactionRouter);
server.use("/api/budgets", verifyToken.userAccess, budgetRouter);
server.use("/api/pots", verifyToken.userAccess, potRouter);
server.use("/api/balance", verifyToken.userAccess, balanceRouter);
server.use("/api/users", verifyToken.adminAccess, userRouter);
server.use("/api/signup", sighUpRouter);
server.use("/api/login", authRouter);
server.use("/api/clear", verifyToken.adminAccess, dbRouter);
server.use("/api/token", verifyToken.userAccess, tokenRouter);

// Running server
server.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  await mongoose.connect(`${process.env.DB_URL}`, {
    dbName: "finances",
  });
});
