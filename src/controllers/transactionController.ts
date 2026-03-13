import { Request, Response } from "express";
import { ServerResponse, TransactionType } from "../types";
import { Transaction } from "../schemas/Transaction";
import { MESSAGES } from "../constants";

class TransactionController {
  private getCurrentPage(pageCount: number, page: number): number {
    const current = page || 1;
    return pageCount * (current - 1);
  }

  private getFilters(req: Request): any {
    const filter = { ...req.query };
    if (filter.hasOwnProperty("page")) {
      delete filter.page;
    }
    if (filter.hasOwnProperty("q")) {
      delete filter.q;
    }
    if (filter.hasOwnProperty("sort")) {
      delete filter.sort;
    }
    if (filter.hasOwnProperty("limit")) {
      delete filter.limit;
    }
    return filter;
  }

  async getTransactions(req: Request, res: Response<ServerResponse<TransactionType[]>>) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : 10;
      const sort = `field ${req.query.sort ? req.query.sort : "-date"}`;
      const skip = this.getCurrentPage(limit, Number(req.query.page) || 1);
      const filter = this.getFilters(req);

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
      res.send({ msg: MESSAGES.serverError });
    }
  }
}

export default new TransactionController();
