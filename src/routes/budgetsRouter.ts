import { Router } from "express";
import budgetsController from "../controllers/budgetsController";

const budgetsRouter = Router();

budgetsRouter.get("/budgets", budgetsController.getBudgets);
budgetsRouter.post("/budgets", budgetsController.addBudget);
budgetsRouter.patch("/budgets/:id", budgetsController.editBudget);
budgetsRouter.delete("/budgets/:id", budgetsController.deleteBudget);

export default budgetsRouter;
