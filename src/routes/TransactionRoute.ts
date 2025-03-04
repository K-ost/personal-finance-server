import { Request, Response, Router } from "express";
import { Transaction } from "../schemas/Transaction";
import { RequestController } from "../api";
import { TransactionType } from "../types";
import { PAGE_COUNT } from "../constants";

const transactionRouter = Router();
const request = new RequestController();

transactionRouter.get("/", async (req: Request, res: Response) =>
  request.getData<TransactionType>(req, res, Transaction, PAGE_COUNT)
);

export default transactionRouter;
