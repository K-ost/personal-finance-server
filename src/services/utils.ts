import { Request } from "express";

export function getCurrentPage(pageCount: number, page: number): number {
  const current = page || 1;
  return pageCount * (current - 1);
}

export function getFilters(req: Request) {
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
