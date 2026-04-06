import { Router } from "express";
import dbController from "../controllers/dbController";

const dbRouter = Router();

dbRouter.get("/balance", dbController.getBalance);
dbRouter.post("/clean", dbController.cleanDatabase);

export default dbRouter;
