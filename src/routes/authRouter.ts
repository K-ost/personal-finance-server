import { Router } from "express";
import authController from "../controllers/authController";

const authRouter = Router();

authRouter.post("/register", authController.register);
authRouter.post("/login", authController.login);
authRouter.get("/refresh", authController.refresh);
authRouter.post("/logout", authController.logout);

export default authRouter;
