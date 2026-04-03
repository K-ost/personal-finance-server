import { Request, Response } from "express";
import { Transaction } from "../schemas/Transaction";
import { MESSAGES } from "../constants";
import { Budget } from "../schemas/Budget";
import { Pot } from "../schemas/Pot";

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

  async cleanDatabase(_: Request, res: Response) {
    try {
      const dataBudgets = await Budget.deleteMany({ isDefault: false });
      const dataPots = await Pot.deleteMany({ isDefault: false });
      if (dataBudgets.deletedCount === 0 && dataPots.deletedCount === 0) {
        res.status(403).send({ msg: "There are no entities to delete" });
        return;
      }
      res.status(200).send({ msg: "Database has been cleaned" });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }
}

export default new DbController();
