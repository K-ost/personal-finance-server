import { NextFunction, Request, Response } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import { MESSAGES } from "../constants";

interface AuthRequest extends Request {
  user?: JwtPayload | string;
}

function authMiddleware(req: AuthRequest, res: Response, next: NextFunction) {
  try {
    const auth = req.headers.authorization;
    if (!auth) {
      res.status(400).send({ msg: MESSAGES.auth.noAuth });
      return;
    }

    const token = auth.split(" ")[1];

    jwt.verify(token, process.env.ACCESS_TOKEN as string, (err, data) => {
      if (err) {
        res.status(400).send({ msg: MESSAGES.auth.noToken });
        return;
      }
      req.user = data;
      next();
    });
  } catch (error) {
    res.status(500).send({ msg: MESSAGES.serverError });
  }
}

export default authMiddleware;
