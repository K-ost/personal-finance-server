import { Request, Response } from "express";
import { Model } from "mongoose";
import { getCurrentPage, getFilters } from "./utils";
import { FORBIDDEN_IDS, SERVER_ERROR } from "./constants";

export class RequestData {
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
      res.send({ msg: SERVER_ERROR });
    }
  }

  async getSingleData<T>(req: Request, res: Response, model: Model<T>) {
    try {
      const data = await model.findById(req.params.id);
      res.status(200).send(data);
    } catch (error) {
      res.send({ msg: SERVER_ERROR });
    }
  }

  async postData<T>(req: Request, res: Response, model: Model<T>) {
    try {
      const data = await model.create(req.body);
      res.send(data);
    } catch (error) {
      res.send({ msg: SERVER_ERROR });
    }
  }

  async editData<T>(req: Request, res: Response, model: Model<T>) {
    try {
      const isForbidden = FORBIDDEN_IDS.some((el) => el === req.params.id);
      if (isForbidden) {
        res.status(403).send({ msg: "This entity cannot be edited" });
        return;
      }
      const data = await model.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(201).send(data);
    } catch (error) {
      res.send({ msg: SERVER_ERROR });
    }
  }

  async deleteData<T>(req: Request, res: Response, model: Model<T>) {
    try {
      const isForbidden = FORBIDDEN_IDS.some((el) => el === req.params.id);
      if (isForbidden) {
        res.status(403).send({ msg: "This entity cannot be removed" });
        return;
      }
      await model.deleteOne({ _id: req.params.id });
      res.send({ msg: "Entity has been removed" });
    } catch (error) {
      res.send({ msg: SERVER_ERROR });
    }
  }
}
