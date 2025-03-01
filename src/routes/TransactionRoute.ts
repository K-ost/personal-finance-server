import { Request, Response, Router } from "express";
import { Transaction } from "../schemas/Transaction";
import { RequestData } from "../api";
import { TransactionType } from "../types";
import { PAGE_COUNT } from "../constants";

const transactionRouter = Router();
const request = new RequestData();

transactionRouter.get("/", async (req: Request, res: Response) =>
  request.getData<TransactionType>(req, res, Transaction, PAGE_COUNT)
);

transactionRouter.get("/:id", async (req: Request, res: Response) =>
  request.getSingleData<TransactionType>(req, res, Transaction)
);

export default transactionRouter;
