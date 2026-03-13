import { model, Schema } from "mongoose";
import { BudgetType } from "../types";

const budgetSchema = new Schema<BudgetType>({
  category: { type: String, required: true },
  maximum: { type: Number, required: true },
  theme: { type: String, required: true },
});

export const Budget = model("Budget", budgetSchema);
