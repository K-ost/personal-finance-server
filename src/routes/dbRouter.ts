import { Router } from "express";
import dbController from "../controllers/dbController";
import authMiddleware from "../middleware/auth-middleware";

const dbRouter = Router();

dbRouter.get("/balance", authMiddleware, dbController.getBalance);

export default dbRouter;
