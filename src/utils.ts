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
