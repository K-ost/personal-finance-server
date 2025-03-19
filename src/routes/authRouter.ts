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
    const { email, password } = req.body;
    const user = await User.findOne({ email });

    if (!user) {
      return res.status(403).send({ msg: "User doesn't exist" });
    }

    const matchedPass = bcrypt.compareSync(password, user.password);

    if (!matchedPass) {
      return res.status(403).send({ msg: "Incorrect password" });
    }

    // Generating access token
    const accessToken = jwt.sign(
      { email, password, role: user.role, userId: user._id },
      TOKEN_KEY!,
      {
        expiresIn: TOKEN_TIME,
      }
    );

    const output: LoginResponse = {
      accessToken,
      user,
    };
    return res.status(201).send(output);
  } catch (error) {
    res.status(500).send({ msg: MESSAGES.serverError });
  }
});

export default authRouter;
