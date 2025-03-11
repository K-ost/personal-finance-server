import { Request, Response, Router } from "express";
import { Pot } from "../schemas/Pot";
import { RequestController } from "../api";
import { PotType } from "../types";

const potRouter = Router();
const request = new RequestController();

potRouter.get(
  "/",
  async (req: Request, res: Response): Promise<void> =>
    request.getData<PotType>(req, res, Pot)
);

potRouter.post(
  "/",
  async (req: Request, res: Response): Promise<void> =>
    request.postData<PotType>(req, res, Pot)
);

potRouter.patch(
  "/:id",
  async (req: Request, res: Response): Promise<void> =>
    request.editData<PotType>(req, res, Pot)
);

potRouter.delete(
  "/:id",
  async (req: Request, res: Response): Promise<void> =>
    request.deleteData<PotType>(req, res, Pot)
);

export default potRouter;
