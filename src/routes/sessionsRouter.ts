import { Router } from "express";
import sessionController from "../controllers/sessionController";
import authMiddleware from "../middleware/auth-middleware";

const sessionRouter = Router();

sessionRouter.get("/sessions", sessionController.getAllSessions);
sessionRouter.delete("/clear", sessionController.clearAllSessions);

export default sessionRouter;
