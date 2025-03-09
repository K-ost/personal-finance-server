import { Response, Router } from "express";
import { RequestController } from "../api";

const dbRouter = Router();
const request = new RequestController();

dbRouter.delete("/", async (__, res: Response) => request.clearAll(res));

export default dbRouter;
