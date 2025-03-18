import { Request, Response, Router } from "express";
import { RequestController } from "../api";
import { UserType } from "../types";
import { User } from "../schemas/User";
import { body, Result, validationResult } from "express-validator";

const userRouter = Router();
const request = new RequestController();

userRouter.get("/", async (req: Request, res: Response) =>
  request.getData<UserType>(req, res, User)
);

userRouter.patch(
  "/:id",
  [
    body("password")
      .trim()
      .isLength({ min: 6 })
      .withMessage("Password must contain at least 6 characters"),
  ],
  async (req: Request, res: Response): Promise<void> => {
    const result: Result = validationResult(req);
    const errors = result.array();
    if (errors.length) {
      res.status(403).send({ errors });
      return;
    }
    request.editData<UserType>(req, res, User);
  }
);

userRouter.delete("/:id", async (req: Request, res: Response) =>
  request.deleteData<UserType>(req, res, User)
);

export default userRouter;
