import { Request, Response, Router } from "express";
import { deleteData, requestData, requestSingleData } from "../api";
import { UserType } from "../types";
import { PAGE_COUNT } from "../constants";
import { User } from "../schemas/User";

const userRouter = Router();

userRouter.get("/", async (req: Request, res: Response) =>
  requestData<UserType>(req, res, User, PAGE_COUNT)
);

userRouter.get("/:id", async (req: Request, res: Response) =>
  requestSingleData<UserType>(req, res, User)
);

userRouter.delete("/:id", async (req: Request, res: Response) =>
  deleteData<UserType>(req, res, User)
);

export default userRouter;
