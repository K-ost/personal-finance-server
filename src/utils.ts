import { NextFunction, Request, Response } from "express";
import { Model } from "mongoose";
import jwt from "jsonwebtoken";
import { SERVER_ERROR, TOKEN_KEY } from "./constants";

export const getCurrentPage = (pageCount: number, page: number): number => {
  const current = page || 1;
  return pageCount * (current - 1);
};

export const getFilters = (req: Request): any => {
  const filter = req.query;
  if (filter.hasOwnProperty("page")) {
    delete filter.page;
  }
  if (filter.hasOwnProperty("sort")) {
    delete filter.sort;
  }
  return filter;
};

export const requestData = async <T>(
  schema: Model<T>,
  req: Request,
  res: Response,
  pageCount: number
): Promise<void> => {
  const sort = `field ${req.query.sort ? req.query.sort : "date"}`;
  const currentPage = getCurrentPage(pageCount, Number(req.query.page) || 1);
  const filter = getFilters(req);

  try {
    const length = (await schema.find({})).length;

    const data = await schema.find(filter).sort(sort).skip(currentPage).limit(pageCount);

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
  schema: Model<T>,
  req: Request,
  res: Response
): Promise<void> => {
  try {
    const data = await schema.findById(req.params.id);
    res.status(200).send(data);
  } catch (error) {
    res.send({ msg: SERVER_ERROR });
  }
};

// Middleware
export const verifyToken = (req: Request, res: Response, next: NextFunction): void => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  if (!token) res.status(401).send({ msg: "Access denied" });
  if (token) {
    jwt.verify(token, TOKEN_KEY, (err, decoded) => {
      if (err) return res.status(403).send({ msg: "Invalid token" });
      next();
    });
  }
};
