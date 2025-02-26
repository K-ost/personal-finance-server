import { Request, Response, Router } from "express";
import { Pot } from "../schemas/Pot";
import { requestData, requestSingleData } from "../utils";
import { PAGE_COUNT } from "../constants";

const potRouter = Router();

potRouter.get("/", async (req: Request, res: Response) =>
  requestData(Pot, req, res, PAGE_COUNT)
);

potRouter.get("/:id", async (req: Request, res: Response) =>
  requestSingleData(Pot, req, res)
);

export default potRouter;
