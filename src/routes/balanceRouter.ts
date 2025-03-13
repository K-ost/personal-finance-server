import { Response, Router } from "express";
import { Transaction } from "../schemas/Transaction";
import { MESSAGES } from "../constants";
import { BalanceType } from "../types";

const balanceRouter = Router();

balanceRouter.get(
  "/",
  async (__, res: Response<BalanceType | { msg: string }>): Promise<void> => {
    try {
      const expensesTransactions = await Transaction.find({ amount: { $lte: 0 } });
      const incomeTransactions = await Transaction.find({ amount: { $gte: 0 } });
      const expenses = Math.abs(
        expensesTransactions.reduce((acum, el) => (acum += el.amount), 0)
      );
      const income = incomeTransactions.reduce((acum, el) => (acum += el.amount), 0);

      res.status(200).send({
        current: 0,
        expenses,
        income,
      });
    } catch (error) {
      res.send({ msg: MESSAGES.serverError });
    }
  }
);

export default balanceRouter;
