import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { MESSAGES } from "./constants";
import { getToken } from "./utils";
import { RoleType } from "./types";

declare module "express-serve-static-core" {
  interface Request {
    userId?: string;
  }
}

dotenv.config();
export const TOKEN_KEY = process.env.JWT_KEY;

const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
  role: RoleType
): void => {
  const token = getToken(req);
  if (!token) res.status(401).send({ msg: MESSAGES.token.accessDenied });
  if (token && TOKEN_KEY) {
    jwt.verify(token, TOKEN_KEY, (err, decoded: any) => {
      if (err) {
        res.sendStatus(401);
        return;
      }
      req.userId = decoded.userId;
      if (role === "admin" && decoded.role !== "admin") {
        res.status(401).send({ msg: MESSAGES.token.adminOnly });
        return;
      }
      next();
    });
  }
};

export class VerifyToken {
  userAccess(req: Request, res: Response, next: NextFunction): void {
    verifyToken(req, res, next, "user");
  }

  adminAccess(req: Request, res: Response, next: NextFunction): void {
    verifyToken(req, res, next, "admin");
  }
}
