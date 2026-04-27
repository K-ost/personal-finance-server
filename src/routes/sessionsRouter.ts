import { Router } from "express";
import sessionController from "../controllers/sessionController";
import authMiddleware from "../middleware/auth-middleware";

const sessionRouter = Router();

sessionRouter.get("/sessions", authMiddleware, sessionController.getAllSessions);
sessionRouter.delete("/clear", authMiddleware, sessionController.clearAllSessions);

export default sessionRouter;
