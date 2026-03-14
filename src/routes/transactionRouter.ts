import { Router } from "express";
import transactionController from "../controllers/transactionController";

const transactionRouter = Router();

transactionRouter.get("/transactions", transactionController.getTransactions);
transactionRouter.get("/transactions/recuring", transactionController.getRecurringBills);

export default transactionRouter;
