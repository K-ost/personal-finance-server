import { Request, Response, Router } from "express";
import { requestData } from "../api";
import { UserType } from "../types";
import { PAGE_COUNT } from "../constants";
import { User } from "../schemas/User";

const userRouter = Router();

userRouter.get("/", async (req: Request, res: Response) =>
  requestData<UserType>(req, res, User, PAGE_COUNT)
);

export default userRouter;
