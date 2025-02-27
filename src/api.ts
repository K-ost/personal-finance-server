import { Request, Response } from "express";
import { Model } from "mongoose";
import { getCurrentPage, getFilters } from "./utils";
import { SERVER_ERROR } from "./constants";

export const requestData = async <T>(
  req: Request,
  res: Response,
  model: Model<T>,
  pageCount: number
): Promise<void> => {
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
};

export const requestSingleData = async <T>(
  req: Request,
  res: Response,
  model: Model<T>
): Promise<void> => {
  try {
    const data = await model.findById(req.params.id);
    res.status(200).send(data);
  } catch (error) {
    res.send({ msg: SERVER_ERROR });
  }
};

export const postData = async <T>(
  req: Request,
  res: Response,
  model: Model<T>
): Promise<void> => {
  try {
    const data = await model.create(req.body);
    res.send(data);
  } catch (error) {
    res.send({ msg: SERVER_ERROR });
  }
};

export const editData = async <T>(
  req: Request,
  res: Response,
  model: Model<T>
): Promise<void> => {
  try {
    const data = await model.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(data);
  } catch (error) {
    res.send({ msg: SERVER_ERROR });
  }
};

export const deleteData = async <T>(
  req: Request,
  res: Response,
  model: Model<T>
): Promise<void> => {
  try {
    await model.deleteOne({ _id: req.params.id });
    res.send({ msg: "Budget has been removed" });
  } catch (error) {
    res.send({ msg: SERVER_ERROR });
  }
};
