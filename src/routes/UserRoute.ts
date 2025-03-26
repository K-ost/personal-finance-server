import { Request, Response, Router } from "express";
import { body, Result, validationResult } from "express-validator";
import bcrypt from "bcryptjs";
import { RequestController } from "../api";
import { UserType } from "../types";
import { User } from "../schemas/User";
import { MESSAGES } from "../constants";
import { VerifyToken } from "../middleware";

const userRouter = Router();
const request = new RequestController();
const verifyToken = new VerifyToken();

userRouter.get("/", verifyToken.adminAccess, async (req: Request, res: Response) =>
  request.getData<UserType>(req, res, User)
);

userRouter.patch(
  "/:id",
  verifyToken.userAccess,
  [
    body("password")
      .trim()
      .optional()
      .isLength({ min: 6 })
      .withMessage("Password must contain at least 6 characters"),
  ],
  async (req: Request, res: Response): Promise<void> => {
    try {
      const result: Result = validationResult(req);
      const errors = result.array();

      if (errors.length) {
        res.status(403).send({ errors });
        return;
      }

      if (req.body.password) {
        const hashedPass = bcrypt.hashSync(req.body.password, 7);
        req.body.password = hashedPass;
      }

      const data = await User.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      const user: Omit<UserType, "password"> = {
        avatar: data!.avatar,
        email: data!.email,
        role: data!.role,
        name: data!.name,
        _id: data!._id,
      };

      res.status(201).send({ data: user, msg: MESSAGES.entityEdited });
    } catch (error) {
      res.send({ msg: MESSAGES.serverError });
    }
  }
);

userRouter.patch(
  "/password/:id",
  verifyToken.userAccess,
  async (req: Request, res: Response): Promise<void> => {
    try {
      const { oldPass, newPass } = req.body;
      const user = await User.findById(req.params.id);
      const matchedPass = bcrypt.compareSync(oldPass, user!.password);
      if (!matchedPass) {
        res.status(403).send({ msg: MESSAGES.passIncorrect });
        return;
      }
      const hashedNewPass = bcrypt.hashSync(newPass, 7);
      await User.findByIdAndUpdate(req.params.id, {
        password: hashedNewPass,
      });
      res.status(201).send({ msg: MESSAGES.passChanged });
    } catch (error) {
      res.send({ msg: MESSAGES.serverError });
    }
  }
);

userRouter.delete("/:id", verifyToken.adminAccess, async (req: Request, res: Response) =>
  request.deleteData<UserType>(req, res, User)
);

export default userRouter;
