import express, { Express, Request, Response } from "express";
import mongoose from "mongoose";
import dotenv from "dotenv";
import bodyParser from "body-parser";
import transactionRouter from "./routes/TransactionRoute";
import budgetRouter from "./routes/budgetRouter";
import potRouter from "./routes/potRouter";
import authRouter from "./routes/authRouter";
import sighUpRouter from "./routes/signUpRouter";
import userRouter from "./routes/UserRoute";
import { VerifyToken } from "./middleware";

// Server settings
dotenv.config();
const server: Express = express();
const PORT = process.env.PORT || 8000;
server.set("json spaces", 2);
server.use(bodyParser.json());
const verifyToken = new VerifyToken();

// Main route
server.get("/", (__, res: Response) => {
  res.sendFile(__dirname + "/index.html");
});

// Routes
server.use("/api/transactions", verifyToken.userAccess, transactionRouter);
server.use("/api/budgets", verifyToken.userAccess, budgetRouter);
server.use("/api/pots", verifyToken.userAccess, potRouter);
server.use("/api/users", verifyToken.adminAccess, userRouter);
server.use("/api/signup", sighUpRouter);
server.use("/api/login", authRouter);

// Running server
server.listen(PORT, async () => {
  console.log(`Server is running at http://localhost:${PORT}`);
  await mongoose.connect(
    `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s9jj6.mongodb.net/`,
    {
      dbName: "finances",
    }
  );
});
