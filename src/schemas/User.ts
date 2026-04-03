import { model, Schema } from "mongoose";
import { UserType } from "../types";

const userSchema = new Schema<UserType>({
  email: { type: String, required: true },
  name: { type: String, required: true },
  password: { type: String, required: true },
});

export const User = model("User", userSchema);
