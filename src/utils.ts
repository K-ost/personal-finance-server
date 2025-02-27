import { Request } from "express";

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

export const getToken = (req: Request): string => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  return token!;
};
