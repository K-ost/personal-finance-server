"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Budget = void 0;
const mongoose_1 = require("mongoose");
const budgetSchema = new mongoose_1.Schema({
    category: { type: String, required: true },
    maximum: { type: Number, required: true },
    theme: { type: String, required: true },
    userId: { type: String, required: true },
});
exports.Budget = (0, mongoose_1.model)("Budget", budgetSchema);
