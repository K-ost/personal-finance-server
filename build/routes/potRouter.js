"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const Pot_1 = require("../schemas/Pot");
const api_1 = require("../api");
const potRouter = (0, express_1.Router)();
const request = new api_1.RequestController();
potRouter.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return request.getData(req, res, Pot_1.Pot); }));
potRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return request.postData(req, res, Pot_1.Pot); }));
potRouter.patch("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return request.editData(req, res, Pot_1.Pot); }));
potRouter.delete("/:id", (req, res) => __awaiter(void 0, void 0, void 0, function* () { return request.deleteData(req, res, Pot_1.Pot); }));
exports.default = potRouter;
