import { Router } from "express";
import transactionController from "../controllers/transactionController";
import authMiddleware from "../middleware/auth-middleware";

const transactionRouter = Router();

transactionRouter.get(
  "/transactions",
  authMiddleware,
  transactionController.getTransactions,
);

transactionRouter.get(
  "/transactions/recuring",
  authMiddleware,
  transactionController.getRecurringBills,
);

export default transactionRouter;
