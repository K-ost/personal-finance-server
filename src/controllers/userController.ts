import { Request, Response } from "express";
import { MESSAGES } from "../constants";
import { User } from "../schemas/User";
import { Types } from "mongoose";

interface IUserController {
  getUsers(req: Request, res: Response): Promise<void>;
  deleteUserById(req: Request, res: Response): Promise<void>;
}

class UserController implements IUserController {
  async getUsers(req: Request, res: Response): Promise<void> {
    try {
      const users = await User.find({}, { password: false }).lean();
      const data = users.map((user) => ({
        id: user._id,
        ...user,
        _id: undefined,
      }));
      res.status(200).send(data);
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }

  async deleteUserById(req: Request, res: Response): Promise<void> {
    try {
      const id = req.params.id;
      const user = await User.deleteOne({ _id: new Types.ObjectId(id) });
      if (user.deletedCount === 0) {
        res.status(404).send({ msg: MESSAGES.entityNotExists });
        return;
      }
      res.status(200).send({ msg: MESSAGES.entityDeleted });
    } catch (error) {
      res.status(500).send({ msg: MESSAGES.serverError });
    }
  }
}

export default new UserController();
