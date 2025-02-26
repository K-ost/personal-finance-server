import { Request, Response, Router } from "express";
import bcrypt from "bcryptjs";
import { User } from "../schemas/User";

const sighUpRouter = Router();

sighUpRouter.post("/", async (req: Request, res: Response): Promise<any> => {
  try {
    const { email, name, password } = req.body;
    const existed = await User.findOne({ email });

    if (!!existed) {
      return res.status(403).send({ msg: "User already exists" });
    }

    const hashedPass = bcrypt.hashSync(password, 7);

    console.log(email, name, hashedPass);

    const data = await User.create({
      avatar: "",
      email,
      name,
      password: hashedPass,
      role: "user",
    });

    return res.status(201).send(data);
  } catch (error) {
    res.status(500).send({ msg: "Server error" });
  }
});

export default sighUpRouter;
