import { Request, Response } from "express";
import { Transaction } from "../schemas/Transaction";
import { MESSAGES } from "../constants";

class DbController {
  async getBalance(req: Request, res: Response) {
    try {
      const expensesTransactions = await Transaction.find({ amount: { $lte: 0 } });
      const incomeTransactions = await Transaction.find({ amount: { $gte: 0 } });
      const expenses = Math.abs(
        expensesTransactions.reduce((acum, el) => (acum += el.amount), 0),
      );
      const income = incomeTransactions.reduce((acum, el) => (acum += el.amount), 0);

      res.status(200).send({
        current: 0,
        expenses,
        income,
      });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }
}

export default new DbController();
