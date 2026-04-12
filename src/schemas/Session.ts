import { model, Schema } from "mongoose";
import { SessionType } from "../types";

const sessionSchema = new Schema<SessionType>({
  token: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
});

export const Session = model("Session", sessionSchema);
