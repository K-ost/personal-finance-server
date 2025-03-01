import { Request, Response, Router } from "express";
import { RequestData } from "../api";
import { UserType } from "../types";
import { PAGE_COUNT } from "../constants";
import { User } from "../schemas/User";

const userRouter = Router();
const request = new RequestData();

userRouter.get("/", async (req: Request, res: Response) =>
  request.getData<UserType>(req, res, User, PAGE_COUNT)
);

userRouter.get("/:id", async (req: Request, res: Response) =>
  request.getSingleData<UserType>(req, res, User)
);

userRouter.delete("/:id", async (req: Request, res: Response) =>
  request.deleteData<UserType>(req, res, User)
);

export default userRouter;
