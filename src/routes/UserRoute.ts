import { Request, Response, Router } from "express";
import { RequestController } from "../api";
import { UserType } from "../types";
import { PAGE_COUNT } from "../constants";
import { User } from "../schemas/User";

const userRouter = Router();
const request = new RequestController();

userRouter.get("/", async (req: Request, res: Response) =>
  request.getData<UserType>(req, res, User, PAGE_COUNT)
);

userRouter.delete("/:id", async (req: Request, res: Response) =>
  request.deleteData<UserType>(req, res, User)
);

export default userRouter;
