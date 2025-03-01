import { Request, Response, Router } from "express";
import { Budget } from "../schemas/Budget";
import { RequestData } from "../api";
import { PAGE_COUNT } from "../constants";
import { BudgetType } from "../types";

const budgetRouter = Router();
const request = new RequestData();

budgetRouter.get("/", async (req: Request, res: Response) => {
  request.getData<BudgetType>(req, res, Budget, PAGE_COUNT);
});

budgetRouter.get("/:id", async (req: Request, res: Response) => {
  request.getSingleData<BudgetType>(req, res, Budget);
});

budgetRouter.post(
  "/",
  async (req: Request, res: Response): Promise<void> => request.postData(req, res, Budget)
);

budgetRouter.patch(
  "/:id",
  async (req: Request, res: Response): Promise<void> => request.editData(req, res, Budget)
);

budgetRouter.delete(
  "/:id",
  async (req: Request, res: Response): Promise<void> =>
    request.deleteData(req, res, Budget)
);

export default budgetRouter;
