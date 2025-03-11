"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Transaction = void 0;
const mongoose_1 = require("mongoose");
const transactionSchema = new mongoose_1.Schema({
    amount: { type: Number, required: true },
    avatar: { type: String, required: true },
    category: { type: String, required: true },
    date: { type: Date, required: true },
    name: { type: String, required: true },
    recurring: { type: Boolean, required: true },
});
exports.Transaction = (0, mongoose_1.model)("Transaction", transactionSchema);
