import { Request, Response } from "express";
import { Budget } from "../schemas/Budget";
import { MESSAGES } from "../constants";

class BudgetsController {
  async getBudgets(req: Request, res: Response) {
    try {
      const data = await Budget.aggregate([
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
      res.send({ msg: MESSAGES.serverError });
    }
  }

  async addBudget(req: Request, res: Response) {
    try {
      const data = await Budget.create(req.body);
      res.send({ data, msg: MESSAGES.entityAdded });
    } catch (error) {
      res.send({ msg: MESSAGES.serverError });
    }
  }

  async editBudget(req: Request, res: Response) {
    try {
      const data = await Budget.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(201).send({ data: data!, msg: MESSAGES.entityEdited });
    } catch (error) {
      res.send({ msg: MESSAGES.serverError });
    }
  }

  async deleteBudget(req: Request, res: Response) {
    try {
      await Budget.deleteOne({ _id: req.params.id });
      res.send({ msg: MESSAGES.entityDeleted });
    } catch (error) {
      res.send({ msg: MESSAGES.serverError });
    }
  }
}

export default new BudgetsController();
