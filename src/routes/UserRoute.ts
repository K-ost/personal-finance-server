import { Request, Response, Router } from "express";
import { RequestController } from "../api";
import { UserType } from "../types";
import { User } from "../schemas/User";

const userRouter = Router();
const request = new RequestController();

userRouter.get("/", async (req: Request, res: Response) =>
  request.getData<UserType>(req, res, User)
);

userRouter.delete("/:id", async (req: Request, res: Response) =>
  request.deleteData<UserType>(req, res, User)
);

export default userRouter;
