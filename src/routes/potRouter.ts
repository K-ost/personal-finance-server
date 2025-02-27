import { Request, Response, Router } from "express";
import { Pot } from "../schemas/Pot";
import { deleteData, editData, postData, requestData, requestSingleData } from "../api";
import { PAGE_COUNT } from "../constants";
import { PotType } from "../types";

const potRouter = Router();

potRouter.get(
  "/",
  async (req: Request, res: Response): Promise<void> =>
    requestData<PotType>(req, res, Pot, PAGE_COUNT)
);

potRouter.get(
  "/:id",
  async (req: Request, res: Response): Promise<void> =>
    requestSingleData<PotType>(req, res, Pot)
);

potRouter.post(
  "/",
  async (req: Request, res: Response): Promise<void> => postData(req, res, Pot)
);

potRouter.patch(
  "/:id",
  async (req: Request, res: Response): Promise<void> => editData(req, res, Pot)
);

potRouter.delete(
  "/:id",
  async (req: Request, res: Response): Promise<void> => deleteData(req, res, Pot)
);

export default potRouter;
