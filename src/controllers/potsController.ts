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
      const newPot: PotType = { ...req.body, isDefault: false };
      const data = await Pot.create(newPot);
      res.send({ data, msg: MESSAGES.entityAdded });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }

  async editPot(req: Request, res: Response) {
    try {
      const data = await Pot.findOneAndUpdate(
        { _id: req.params.id, isDefault: false },
        req.body,
        { new: true },
      );

      if (!data) {
        res.status(403).send({ msg: MESSAGES.defaultEntity });
        return;
      }

      res.status(200).send({ data: data, msg: MESSAGES.entityEdited });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }

  async deletePot(req: Request, res: Response) {
    try {
      const data = await Pot.findOneAndDelete({ _id: req.params.id, isDefault: false });
      if (!data) {
        res.status(403).send({ msg: MESSAGES.defaultEntity });
        return;
      }
      res.send({ msg: MESSAGES.entityDeleted });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }
}

export default new PotsController();
