import { Router } from "express";
import authMiddleware from "../middleware/auth-middleware";
import userController from "../controllers/userController";

const userRouter = Router();

userRouter.get("/users", authMiddleware, userController.getUsers);
userRouter.delete("/users/:id", authMiddleware, userController.deleteUserById);

export default userRouter;
