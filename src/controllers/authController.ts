import { Request, Response } from "express";
import { UserType } from "../types";
import { MESSAGES } from "../constants";

class AuthController {
  async login(req: Request<{}, {}, Omit<UserType, "name">>, res: Response) {
    try {
      const { email, password } = req.body;
      if (email !== "test@test.com") {
        res.status(401).send({ msg: MESSAGES.emailIncorrect });
        return;
      }
      if (password !== "1111") {
        res.status(401).send({ msg: MESSAGES.passIncorrect });
        return;
      }
      res.status(201).send({ accessToken: "mock-access-token" });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }
}

export default new AuthController();
