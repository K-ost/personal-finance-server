import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../schemas/User";
import { LoginResponse } from "../types";
import { MESSAGES, TOKEN_TIME } from "../constants";
import { TOKEN_KEY } from "../middleware";

const authRouter = Router();

authRouter.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const user = await User.findOne({ email: req.body.email });

    if (!user) {
      return res.status(403).send({ msg: "User doesn't exist" });
    }

    const matchedPass = bcrypt.compareSync(req.body.password, user.password);

    if (!matchedPass) {
      return res.status(403).send({ msg: "Incorrect password" });
    }

    // Generating access token
    const accessToken = jwt.sign(
      {
        email: req.body.email,
        password: req.body.password,
        role: user.role,
        userId: user._id,
      },
      TOKEN_KEY!,
      {
        expiresIn: TOKEN_TIME,
      }
    );

    const { password, ...withoutPass } = user;

    const output: LoginResponse = {
      accessToken,
      user: withoutPass,
    };
    return res.status(201).send(output);
  } catch (error) {
    res.status(500).send({ msg: MESSAGES.serverError });
  }
});

export default authRouter;
