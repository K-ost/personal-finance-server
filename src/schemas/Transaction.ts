import { model, Schema } from "mongoose";
import { TransactionType } from "../types";

const transactionSchema = new Schema<TransactionType>({
  amount: { type: Number, required: true },
  avatar: { type: String, required: true },
  category: { type: String, required: true },
  date: { type: Date, required: true },
  name: { type: String, required: true },
  recurring: { type: Boolean, required: true },
});

export const Transaction = model<TransactionType>("Transaction", transactionSchema);
