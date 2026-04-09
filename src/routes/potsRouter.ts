import { Router } from "express";
import potsController from "../controllers/potsController";
import authMiddleware from "../middleware/auth-middleware";

const potsRouter = Router();

potsRouter.get("/pots", authMiddleware, potsController.getPots);
potsRouter.post("/pots", authMiddleware, potsController.addPot);
potsRouter.patch("/pots/:id", authMiddleware, potsController.editPot);
potsRouter.delete("/pots/:id", authMiddleware, potsController.deletePot);

export default potsRouter;
