import { Router } from "express";
import potsController from "../controllers/potsController";

const potsRouter = Router();

potsRouter.get("/pots", potsController.getPots);
potsRouter.post("/pots", potsController.addPot);
potsRouter.patch("/pots/:id", potsController.editPot);
potsRouter.delete("/pots/:id", potsController.deletePot);

export default potsRouter;
