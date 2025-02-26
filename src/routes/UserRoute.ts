import { Request, Response, Router } from "express";
import { requestData } from "../utils";
import { UserType } from "../types";
import { PAGE_COUNT } from "../constants";
import { User } from "../schemas/User";

const userRouter = Router();

userRouter.get("/", async (req: Request, res: Response) =>
  requestData<UserType>(User, req, res, PAGE_COUNT)
);

export default userRouter;
