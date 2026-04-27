import { Types } from "mongoose";
import { RoleType, UserServer } from "../types";

class UserDTO {
  id: Types.ObjectId | string;
  email: string;
  name: string;
  role: RoleType;

  constructor(user: UserServer) {
    this.id = user._id || user.id;
    this.email = user.email;
    this.name = user.name;
    this.role = user.role;
  }
}

export default UserDTO;
