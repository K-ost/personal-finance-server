import { Request, Response } from "express";
import { Types } from "mongoose";
import { Session } from "../schemas/Session";
import { MESSAGES } from "../constants";

interface ISessionController {
  getAllSessions(req: Request, res: Response): Promise<void>;
  clearAllSessions(req: Request, res: Response): Promise<void>;
}

class SessionController implements ISessionController {
  async getAllSessions(req: Request, res: Response): Promise<void> {
    try {
      const data = await Session.find();
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }

  async clearAllSessions(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies["refreshToken"];

      if (!refreshToken) {
        res.status(404).send({ msg: MESSAGES.auth.noAuth });
        return;
      }

      const db = await Session.deleteMany({
        token: { $ne: refreshToken },
      });

      if (db.deletedCount === 0) {
        res.status(400).send({ msg: "No active sessions" });
        return;
      }
      res.status(200).send({ msg: "All sessions have been deleted" });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }
}

export default new SessionController();
