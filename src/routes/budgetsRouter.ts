import { Router } from "express";
import budgetsController from "../controllers/budgetsController";
import authMiddleware from "../middleware/auth-middleware";

const budgetsRouter = Router();

budgetsRouter.get("/budgets", authMiddleware, budgetsController.getBudgets);
budgetsRouter.post("/budgets", authMiddleware, budgetsController.addBudget);
budgetsRouter.patch("/budgets/:id", authMiddleware, budgetsController.editBudget);
budgetsRouter.delete("/budgets/:id", authMiddleware, budgetsController.deleteBudget);

export default budgetsRouter;
