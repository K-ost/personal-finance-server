import { model, Schema, Types } from "mongoose";
import { BudgetType } from "../types";

const budgetSchema = new Schema<BudgetType>({
  category: { type: String, required: true },
  maximum: { type: Number, required: true },
  theme: { type: String, required: true },
  userId: { type: Schema.Types.ObjectId, required: true },
});

export const Budget = model("Budget", budgetSchema);
