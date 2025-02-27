import { Request, Response, Router } from "express";
import { Budget } from "../schemas/Budget";
import { deleteData, editData, postData, requestData, requestSingleData } from "../api";
import { PAGE_COUNT } from "../constants";
import { BudgetType } from "../types";

const budgetRouter = Router();

budgetRouter.get("/", async (req: Request, res: Response) => {
  requestData<BudgetType>(req, res, Budget, PAGE_COUNT);
});

budgetRouter.get("/:id", async (req: Request, res: Response) => {
  requestSingleData<BudgetType>(req, res, Budget);
});

budgetRouter.post(
  "/",
  async (req: Request, res: Response): Promise<void> => postData(req, res, Budget)
);

budgetRouter.patch(
  "/:id",
  async (req: Request, res: Response): Promise<void> => editData(req, res, Budget)
);

budgetRouter.delete(
  "/:id",
  async (req: Request, res: Response): Promise<void> => deleteData(req, res, Budget)
);

export default budgetRouter;
