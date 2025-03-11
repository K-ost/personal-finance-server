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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const User_1 = require("../schemas/User");
const constants_1 = require("../constants");
const middleware_1 = require("../middleware");
const authRouter = (0, express_1.Router)();
authRouter.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { email, password } = req.body;
        const user = yield User_1.User.findOne({ email });
        if (!user) {
            return res.status(403).send({ msg: "User doesn't exist" });
        }
        const matchedPass = bcryptjs_1.default.compareSync(password, user.password);
        if (!matchedPass) {
            return res.status(403).send({ msg: "Incorrect password" });
        }
        // Generating access token
        const accessToken = jsonwebtoken_1.default.sign({ email, password, role: user.role, userId: user._id }, middleware_1.TOKEN_KEY, {
            expiresIn: constants_1.TOKEN_TIME,
        });
        const output = {
            accessToken,
            user: {
                avatar: user.avatar,
                email: user.email,
                name: user.name,
                role: user.role,
                _id: user.id,
            },
        };
        return res.status(201).send(output);
    }
    catch (error) {
        res.status(500).send({ msg: constants_1.MESSAGES.serverError });
    }
}));
exports.default = authRouter;
