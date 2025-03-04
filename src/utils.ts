import { Request } from "express";

export const getToken = (req: Request): string => {
  const authHeader = req.header("Authorization");
  const token = authHeader && authHeader.split(" ")[1];
  return token!;
};
