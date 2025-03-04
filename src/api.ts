import { Request, Response } from "express";
import { Model } from "mongoose";
import { FORBIDDEN_USER_IDS, MESSAGES } from "./constants";
import { Pot } from "./schemas/Pot";
import { Budget } from "./schemas/Budget";
import { User } from "./schemas/User";

export class RequestController {
  private getCurrentPage(pageCount: number, page: number): number {
    const current = page || 1;
    return pageCount * (current - 1);
  }

  private getFilters(req: Request): any {
    const filter = req.query;
    if (filter.hasOwnProperty("page")) {
      delete filter.page;
    }
    if (filter.hasOwnProperty("sort")) {
      delete filter.sort;
    }
    return filter;
  }

  private getUserIdFilter(url: string, userId?: string) {
    return url === "/api/transactions" || url === "/api/users" ? {} : { userId };
  }

  async getData<T>(req: Request, res: Response, model: Model<T>, pageCount: number) {
    const sort = `field ${req.query.sort ? req.query.sort : "date"}`;
    const skip = this.getCurrentPage(pageCount, Number(req.query.page) || 1);
    const filter = this.getFilters(req);
    const userIdFilter = this.getUserIdFilter(req.baseUrl, req.userId);

    try {
      const length = (await model.find(userIdFilter)).length;

      const data = await model
        .find({ ...filter, ...userIdFilter })
        .sort(sort)
        .skip(skip)
        .limit(pageCount);

      res.status(200).send({
        data,
        count: length,
        page: req.query.page || 1,
      });
    } catch (error) {
      res.send({ msg: MESSAGES.serverError });
    }
  }

  async postData<T>(req: Request, res: Response, model: Model<T>) {
    try {
      const { name, userId } = req.body;
      const existed = await model.findOne({ userId, name });
      if (!!existed) {
        res.status(403).send({ msg: MESSAGES.entityExists });
        return;
      }
      const data = await model.create(req.body);
      res.send(data);
    } catch (error) {
      res.send({ msg: MESSAGES.serverError });
    }
  }

  async editData<T>(req: Request, res: Response, model: Model<T>) {
    try {
      const data = await model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(201).send(data);
    } catch (error) {
      res.send({ msg: MESSAGES.serverError });
    }
  }

  async deleteData<T>(req: Request, res: Response, model: Model<T>) {
    try {
      await model.deleteOne({ _id: req.params.id });
      res.send({ msg: "Entity has been removed" });
    } catch (error) {
      res.send({ msg: MESSAGES.serverError });
    }
  }

  async clearAll(req: Request, res: Response) {
    try {
      const filter = { $nin: FORBIDDEN_USER_IDS };
      await Budget.deleteMany({ userId: filter });
      await Pot.deleteMany({ userId: filter });
      await User.deleteMany({ _id: filter });
      res.send({ msg: "Database has been cleaned" });
    } catch (error) {
      res.send({ msg: MESSAGES.serverError });
    }
  }
}
