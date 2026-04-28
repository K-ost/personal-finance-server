import { Request, Response } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { UserServer, UserType } from "../types";
import { MESSAGES, cookieOptions } from "../constants";
import { User } from "../schemas/User";
import tokenService from "../services/tokenService";
import UserDTO from "../services/UserDto";
import { Session } from "../schemas/Session";

interface IAuthController {
  register(req: Request<{}, {}, UserType>, res: Response): Promise<void>;
  login(req: Request<{}, {}, Omit<UserType, "name">>, res: Response): Promise<void>;
  refresh(req: Request, res: Response): Promise<void>;
  logout(req: Request, res: Response): Promise<void>;
}

class AuthController implements IAuthController {
  async register(req: Request<{}, {}, UserType>, res: Response): Promise<void> {
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
        role: "user",
      };

      await User.create(newUser);

      res.status(201).send({ msg: MESSAGES.userRegistered });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }

  async login(
    req: Request<{}, {}, Omit<UserType, "name">>,
    res: Response,
  ): Promise<void> {
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

      const userDTO = new UserDTO(user);
      const { accessToken, refreshToken } = tokenService.generateTokens(userDTO);

      await Session.create({ token: refreshToken, userId: user._id });

      res.cookie("refreshToken", refreshToken, cookieOptions);
      res.status(201).send({ accessToken, user: userDTO });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }

  async refresh(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies["refreshToken"];
      if (!refreshToken) {
        res.status(400).send({ msg: MESSAGES.auth.noAuth });
        return;
      }

      const isToken = await Session.findOne({ token: refreshToken });
      if (!isToken) {
        res.status(401).send({ msg: MESSAGES.auth.noAuth });
        return;
      }

      try {
        const isTokenValid = jwt.verify(
          refreshToken,
          process.env.REFRESH_TOKEN as string,
        );

        const userDTO = new UserDTO(isTokenValid as UserServer);
        const { accessToken: newAccessToken, refreshToken: newRefreshToken } =
          tokenService.generateTokens(userDTO);

        await Session.findOneAndUpdate(
          { token: refreshToken },
          { token: newRefreshToken, userId: userDTO.id },
        );

        res.cookie("refreshToken", newRefreshToken, cookieOptions);
        res.status(200).send({ accessToken: newAccessToken, user: userDTO });
      } catch (error) {
        res.status(401).send({ msg: MESSAGES.auth.expired });
      }
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }

  async logout(req: Request, res: Response): Promise<void> {
    try {
      const refreshToken = req.cookies["refreshToken"];
      if (!refreshToken) {
        res.status(400).send({ msg: MESSAGES.auth.noToken });
        return;
      }

      await Session.deleteOne({ token: refreshToken });
      res.clearCookie("refreshToken");
      res.send({ msg: MESSAGES.auth.logout });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }
}

export default new AuthController();
