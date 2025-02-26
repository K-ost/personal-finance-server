import { NextFunction, Request, Response, Router } from "express";
import { Budget } from "../schemas/Budget";
import { requestData, requestSingleData } from "../utils";
import { PAGE_COUNT } from "../constants";

const budgetRouter = Router();

budgetRouter.get("/", async (req: Request, res: Response) => {
  requestData(Budget, req, res, PAGE_COUNT);
});

budgetRouter.get("/:id", async (req: Request, res: Response) => {
  requestSingleData(Budget, req, res);
});

budgetRouter.post(
  "/",
  async (req: Request, res: Response, next: NextFunction): Promise<any> => {
    try {
      const data = await Budget.create(req.body);
      res.send(data);
    } catch (error) {
      res.send({ msg: "Incorrect request" });
    }
  }
);

budgetRouter.patch("/:id", async (req: Request, res: Response) => {
  try {
    const data = await Budget.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.send(data);
  } catch (error) {
    res.send({ msg: "Incorrect request" });
  }
});

budgetRouter.delete("/:id", async (req: Request, res: Response) => {
  try {
    await Budget.deleteOne({ _id: req.params.id });
    res.send({ msg: "Budget has been removed" });
  } catch (error) {
    res.send({ msg: "Incorrect request" });
  }
});

export default budgetRouter;
