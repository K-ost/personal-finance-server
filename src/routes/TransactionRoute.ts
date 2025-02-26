import { Request, Response, Router } from "express";
import { Transaction } from "../schemas/Transaction";
import { requestData, requestSingleData } from "../utils";
import { TransactionType } from "../types";
import { PAGE_COUNT } from "../constants";

const transactionRouter = Router();

transactionRouter.get("/", async (req: Request, res: Response) =>
  requestData<TransactionType>(Transaction, req, res, PAGE_COUNT)
);

transactionRouter.get("/:id", async (req: Request, res: Response) =>
  requestSingleData<TransactionType>(Transaction, req, res)
);

export default transactionRouter;
