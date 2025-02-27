import { NextFunction, Request, Response } from "express";
import jwt from "jsonwebtoken";
import { TOKEN_KEY } from "./constants";

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
