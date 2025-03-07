import { Request, Response, Router } from "express";
import { Budget } from "../schemas/Budget";
import { RequestController } from "../api";
import { BudgetType } from "../types";

const budgetRouter = Router();
const request = new RequestController();

budgetRouter.get("/transactions", async (req: Request, res: Response) => {
  request.getBudgets<BudgetType>(req, res, Budget);
});

budgetRouter.post(
  "/",
  async (req: Request, res: Response): Promise<void> =>
    request.postData<BudgetType>(req, res, Budget)
);

budgetRouter.patch(
  "/:id",
  async (req: Request, res: Response): Promise<void> =>
    request.editData<BudgetType>(req, res, Budget)
);

budgetRouter.delete(
  "/:id",
  async (req: Request, res: Response): Promise<void> =>
    request.deleteData<BudgetType>(req, res, Budget)
);

export default budgetRouter;
