import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserType } from "../types";
import { MESSAGES, OPTIONS } from "../constants";
import { User } from "../schemas/User";
import { getUserDTO } from "../services/utils";

class AuthController {
  async register(req: Request<{}, {}, UserType>, res: Response) {
    try {
      const { email, name, password } = req.body;

      const isUser = await User.findOne({ email });
      if (isUser) {
        res.status(401).send({ msg: `User with email ${email} already exists` });
        return;
      }

      const newUser: UserType = {
        email,
        name,
        password: bcrypt.hashSync(password, 7),
      };

      await User.create(newUser);

      res.status(201).send({ msg: MESSAGES.userRegistered });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }

  async login(req: Request<{}, {}, Omit<UserType, "name">>, res: Response) {
    try {
      const { email, password } = req.body;

      const user = await User.findOne({ email });
      if (!user) {
        res.status(401).send({ msg: MESSAGES.noUser });
        return;
      }

      const isPassValid = bcrypt.compareSync(password, user.password);
      if (!isPassValid) {
        res.status(401).send({ msg: MESSAGES.passIncorrect });
        return;
      }

      const userDTO = getUserDTO(user);
      const accessToken = jwt.sign({ ...userDTO }, process.env.ACCESS_TOKEN as string, {
        expiresIn: "5m",
      });
      const refreshToken = jwt.sign({ ...userDTO }, process.env.REFRESH_TOKEN as string, {
        expiresIn: "1d",
      });

      res.cookie("refreshToken", refreshToken, {
        httpOnly: true,
        maxAge: OPTIONS.refreshAge,
      });

      res.status(201).send({ accessToken, user: userDTO });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }
}

export default new AuthController();
