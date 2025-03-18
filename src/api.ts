import { Request, Response } from "express";
import { Model } from "mongoose";
import bcrypt from "bcryptjs";
import { FORBIDDEN_USER_IDS, MESSAGES, PAGE_COUNT } from "./constants";
import { Pot } from "./schemas/Pot";
import { Budget } from "./schemas/Budget";
import { User } from "./schemas/User";
import { ServerResponse } from "./types";

export class RequestController {
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

  private getUserIdFilter(url: string, userId?: string) {
    return url === "/api/transactions" || url === "/api/users" ? {} : { userId };
  }

  async getTransactions<T>(
    req: Request,
    res: Response<ServerResponse<T[]>>,
    model: Model<T>
  ) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : PAGE_COUNT;
      const sort = `field ${req.query.sort ? req.query.sort : "-date"}`;
      const skip = this.getCurrentPage(limit, Number(req.query.page) || 1);
      const filter = this.getFilters(req);
      const userIdFilter = this.getUserIdFilter(req.baseUrl, req.userId);

      const length = (await model.find(userIdFilter)).length;

      // Search
      let re = new RegExp(String(req.query.q), "i");
      const searchFilter = req.query.q ? { name: re } : {};

      const data = await model
        .find({ ...filter, ...userIdFilter, ...searchFilter })
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

  async getData<T>(req: Request, res: Response, model: Model<T>) {
    try {
      const filter = this.getUserIdFilter(req.baseUrl, req.userId);
      const data = await model.find(filter);
      res.status(200).send(data);
    } catch (error) {
      res.send({ msg: MESSAGES.serverError });
    }
  }

  async getBudgets<T>(req: Request, res: Response, model: Model<T>) {
    try {
      const data = await model.aggregate([
        {
          $match: { userId: req.userId },
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
      res.send({ msg: MESSAGES.serverError });
    }
  }

  async postData<T>(req: Request, res: Response<ServerResponse<T>>, model: Model<T>) {
    try {
      const data = await model.create(req.body);
      res.send({ data, msg: MESSAGES.entityAdded });
    } catch (error) {
      res.send({ msg: MESSAGES.serverError });
    }
  }

  async editData<T>(req: Request, res: Response<ServerResponse<T>>, model: Model<T>) {
    try {
      // if user changes a password
      if (req.body.password) {
        const hashedPass = bcrypt.hashSync(req.body.password, 7);
        req.body.password = hashedPass;
      }
      const data = await model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(201).send({ data: data!, msg: MESSAGES.entityEdited });
    } catch (error) {
      res.send({ msg: MESSAGES.serverError });
    }
  }

  async deleteData<T>(req: Request, res: Response<ServerResponse<T>>, model: Model<T>) {
    try {
      await model.deleteOne({ _id: req.params.id });
      res.send({ msg: MESSAGES.entityDeleted });
    } catch (error) {
      res.send({ msg: MESSAGES.serverError });
    }
  }

  async clearAll(res: Response<ServerResponse<any>>) {
    try {
      const filter = { $nin: FORBIDDEN_USER_IDS };
      await Budget.deleteMany({ userId: filter });
      await Pot.deleteMany({ userId: filter });
      await User.deleteMany({ _id: filter });
      res.send({ msg: MESSAGES.dbCleaned });
    } catch (error) {
      res.send({ msg: MESSAGES.serverError });
    }
  }
}
