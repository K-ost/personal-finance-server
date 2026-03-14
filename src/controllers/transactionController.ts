import { Request, Response } from "express";
import { ServerResponse, TransactionType } from "../types";
import { Transaction } from "../schemas/Transaction";
import { MESSAGES } from "../constants";
import { getCurrentPage, getFilters } from "../services/utils";

class TransactionController {
  async getTransactions(req: Request, res: Response<ServerResponse<TransactionType[]>>) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const sort = `field ${req.query.sort ? req.query.sort : "-date"}`;
      const skip = getCurrentPage(limit, Number(req.query.page) || 1);
      const filter = getFilters(req);

      const length = (await Transaction.find()).length;

      // Search
      let re = new RegExp(String(req.query.q), "i");
      const searchFilter = req.query.q ? { name: re } : {};

      const data = await Transaction.find({ ...filter, ...searchFilter })
        .sort(sort)
        .skip(skip)
        .limit(limit);

      res.status(200).send({
        data,
        count: filter.category || req.query.q ? data.length : length,
        page: Number(req.query.page) || 1,
        msg: "Ok",
      });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }

  async getRecurringBills(req: Request, res: Response) {
    try {
      const data = await Transaction.find({ recurring: true });
      res.status(200).send({ data, msg: "Ok" });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }
}

export default new TransactionController();
