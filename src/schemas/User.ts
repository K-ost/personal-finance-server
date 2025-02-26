import { model, Schema } from "mongoose";
import { UserType } from "../types";

const userSchema = new Schema<UserType>({
  avatar: { type: String, required: false },
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
  role: { type: String, required: true },
});

export const User = model("User", userSchema);
