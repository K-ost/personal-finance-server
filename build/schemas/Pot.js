"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Pot = void 0;
const mongoose_1 = require("mongoose");
const potSchema = new mongoose_1.Schema({
    name: { type: String, required: true },
    target: { type: Number, required: true },
    theme: { type: String, required: true },
    total: { type: Number, required: true },
    userId: { type: String, required: true },
});
exports.Pot = (0, mongoose_1.model)("Pot", potSchema);
