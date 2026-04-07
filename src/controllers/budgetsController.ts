import { Request, Response } from "express";
import { Types } from "mongoose";
import { Budget } from "../schemas/Budget";
import { MESSAGES } from "../constants";
import { BudgetType } from "../types";

class BudgetsController {
  async getBudgets(req: Request, res: Response) {
    try {
      const userId = new Types.ObjectId(req.query.userId as string);

      const data = await Budget.aggregate([
        {
          $match: {
            userId,
          },
        },
        {
          $lookup: {
            from: "transactions",
            localField: "category",
            foreignField: "category",
            as: "latest",
            pipeline: [{ $limit: 3 }],
          },
        },
      ]);
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }

  async addBudget(req: Request<{}, {}, BudgetType>, res: Response) {
    try {
      const newBudget: BudgetType = {
        ...req.body,
        userId: new Types.ObjectId(req.body.userId),
      };
      const data = await Budget.create(newBudget);
      res.status(200).send({ data, msg: MESSAGES.entityAdded });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }

  async editBudget(req: Request, res: Response) {
    try {
      const data = await Budget.findOneAndUpdate({ _id: req.params.id }, req.body, {
        new: true,
      });
      if (!data) {
        res.status(403).send({ msg: MESSAGES.defaultEntity });
        return;
      }
      res.status(200).send({ data, msg: MESSAGES.entityEdited });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }

  async deleteBudget(req: Request, res: Response) {
    try {
      const data = await Budget.findOneAndDelete({
        _id: req.params.id,
      });
      if (!data) {
        res.status(403).send({ msg: MESSAGES.defaultEntity });
        return;
      }
      res.status(200).send({ msg: MESSAGES.entityDeleted });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }
}

export default new BudgetsController();
