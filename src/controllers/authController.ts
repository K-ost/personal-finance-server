import { Request, Response } from "express";
import { User } from "../types";
import { MESSAGES } from "../constants";
import { Transaction } from "../schemas/Transaction";
import { Pot } from "../schemas/Pot";
import { Budget } from "../schemas/Budget";

class AuthController {
  async login(req: Request<{}, {}, User>, res: Response) {
    try {
      const { email, password } = req.body;
      if (email !== "test@test.com") {
        res.status(401).send({ msg: MESSAGES.emailIncorrect });
        return;
      }
      if (password !== "1111") {
        res.status(401).send({ msg: MESSAGES.passIncorrect });
        return;
      }
      res.status(201).send({ accessToken: "mock-access-token" });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }

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

export default new AuthController();
