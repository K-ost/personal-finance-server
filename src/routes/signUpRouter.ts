import { Request, Response, Router } from "express";
import { body, Result, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { User } from "../schemas/User";

const sighUpRouter = Router();

sighUpRouter.post(
  "/",
  [
    body("email")
      .trim()
      .notEmpty()
      .withMessage("Required field")
      .bail()
      .isEmail()
      .withMessage("Incorrect email"),
    body("name")
      .trim()
      .isLength({ min: 3 })
      .withMessage("Name must contain at least 3 characters"),
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must contain at least 6 characters"),
  ],
  async (req: Request, res: Response): Promise<any> => {
    try {
      const result: Result = validationResult(req);
      const errors = result.array();

      if (errors.length) {
        return res.status(403).send({ errors });
      }

      const { email, name, password } = req.body;
      const existed = await User.findOne({ email });

      if (!!existed) {
        return res.status(403).send({ msg: "User already exists" });
      }

      const hashedPass = bcrypt.hashSync(password, 7);

      const data = await User.create({
        avatar: "",
        email,
        name,
        password: hashedPass,
        role: "user",
      });

      res.status(201).send(data);
    } catch (error) {
      res.status(500).send({ msg: "Server error" });
    }
  }
);

export default sighUpRouter;
