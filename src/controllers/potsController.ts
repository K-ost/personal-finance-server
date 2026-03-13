import { Request, Response } from "express";
import { MESSAGES } from "../constants";
import { Pot } from "../schemas/Pot";
import { PotType } from "../types";

class PotsController {
  async getPots(req: Request, res: Response) {
    try {
      const data = await Pot.find();
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }

  async addPot(req: Request<{}, {}, PotType>, res: Response) {
    try {
      const data = await Pot.create(req.body);
      res.send({ data, msg: MESSAGES.entityAdded });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }

  async editPot(req: Request, res: Response) {
    try {
      const data = await Pot.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      res.status(201).send({ data: data, msg: MESSAGES.entityEdited });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }

  async deletePot(req: Request, res: Response) {
    try {
      await Pot.deleteOne({ _id: req.params.id });
      res.send({ msg: MESSAGES.entityDeleted });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }
}

export default new PotsController();
