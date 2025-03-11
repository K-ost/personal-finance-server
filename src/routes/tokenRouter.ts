import { Request, Response, Router } from "express";
import { MESSAGES } from "../constants";

const tokenRouter = Router();

tokenRouter.get("/", async (req: Request, res: Response): Promise<void> => {
  try {
    res.sendStatus(200);
  } catch (error) {
    res.send({ msg: MESSAGES.serverError });
  }
});

export default tokenRouter;
