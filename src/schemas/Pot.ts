import { model, Schema } from "mongoose";
import { PotType } from "../types";

const potSchema = new Schema<PotType>({
  name: { type: String, required: true },
  target: { type: Number, required: true },
  theme: { type: String, required: true },
  total: { type: Number, required: true },
});

export const Pot = model("Pot", potSchema);
