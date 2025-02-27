import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TOKEN_KEY } from "./constants";
import { getToken } from "./utils";
import { RoleType } from "./types";

const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
  role: RoleType
): void => {
  const token = getToken(req);
  if (!token) res.status(401).send({ msg: "Access denied" });
  if (token) {
    jwt.verify(token, TOKEN_KEY, (err, decoded: any) => {
      if (err) return res.status(403).send({ msg: "Invalid token" });
      if (role === "admin" && decoded.role !== "admin") {
        return res.status(403).send({ msg: "Only for admin" });
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
