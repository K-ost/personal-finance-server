import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { User } from "../schemas/User";
import { LoginOutput } from "../types";
import { TOKEN_KEY } from "../constants";

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

    const accessToken = jwt.sign({ email, password, role: user.role }, TOKEN_KEY, {
      expiresIn: "1h",
    });

    const output: LoginOutput = {
      accessToken,
      user: {
        avatar: user.avatar,
        email: user.email,
        name: user.name,
        role: user.role,
        _id: user.id,
      },
    };
    return res.status(201).send(output);
  } catch (error) {
    res.status(500).send({ msg: "Server error" });
  }
});

export default authRouter;
