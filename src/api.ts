import { Request, Response } from "express";
import { Model } from "mongoose";
import { getCurrentPage, getFilters } from "./utils";
import { FORBIDDEN_USER_IDS, MESSAGES } from "./constants";
import { Pot } from "./schemas/Pot";
import { Budget } from "./schemas/Budget";
import { User } from "./schemas/User";

export class RequestController {
  async getData<T>(req: Request, res: Response, model: Model<T>, pageCount: number) {
    const sort = `field ${req.query.sort ? req.query.sort : "date"}`;
    const currentPage = getCurrentPage(pageCount, Number(req.query.page) || 1);
    const filter = getFilters(req);

    try {
      const length = (await model.find({})).length;

      const data = await model.find(filter).sort(sort).skip(currentPage).limit(pageCount);

      res.status(200).send({
        data,
        count: length,
        page: Number(req.query.page) || 1,
      });
    } catch (error) {
      res.send({ msg: MESSAGES.serverError });
    }
  }

  async getSingleData<T>(req: Request, res: Response, model: Model<T>) {
    try {
      const data = await model.findById(req.params.id);
      res.status(200).send(data);
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
