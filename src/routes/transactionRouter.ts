import { Router } from "express";
import transactionController from "../controllers/transactionController";

const transactionRouter = Router();

transactionRouter.get("/transactions", transactionController.getTransactions);

export default transactionRouter;
