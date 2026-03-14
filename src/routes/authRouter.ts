import { Router } from "express";
import authController from "../controllers/authController";

const authRouter = Router();

authRouter.post("/login", authController.login);
authRouter.get("/balance", authController.getBalance);
authRouter.post("/clean", authController.cleanDatabase);

export default authRouter;
