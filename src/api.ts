import { Request, Response } from "express";
import { Model } from "mongoose";
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

  async getData<T>(req: Request, res: Response<ServerResponse<T[]>>, model: Model<T>) {
    try {
      const limit = req.query.limit ? Number(req.query.limit) : PAGE_COUNT;
      const sort = `field ${req.query.sort ? req.query.sort : "date"}`;
      const skip = this.getCurrentPage(limit, Number(req.query.page) || 1);
      const filter = this.getFilters(req);
      const userIdFilter = this.getUserIdFilter(req.baseUrl, req.userId);

      const length = (await model.find(userIdFilter)).length;

      const data = await model
        .find({ ...filter, ...userIdFilter })
        .sort(sort)
        .skip(skip)
        .limit(limit);

      res.status(200).send({
        data,
        count: length,
        page: Number(req.query.page) || 1,
        msg: "Ok",
      });
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
            as: "transactions",
            pipeline: [
              {
                $limit: 3,
              },
            ],
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

  async clearAll(req: Request, res: Response<ServerResponse<any>>) {
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
