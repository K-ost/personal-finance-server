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
const express_validator_1 = require("express-validator");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const User_1 = require("../schemas/User");
const constants_1 = require("../constants");
const sighUpRouter = (0, express_1.Router)();
sighUpRouter.post("/", [
    (0, express_validator_1.body)("email")
        .trim()
        .notEmpty()
        .withMessage("Required field")
        .bail()
        .isEmail()
        .withMessage("Incorrect email"),
    (0, express_validator_1.body)("name")
        .trim()
        .isLength({ min: 3 })
        .withMessage("Name must contain at least 3 characters"),
    (0, express_validator_1.body)("password")
        .trim()
        .isLength({ min: 6 })
        .withMessage("Password must contain at least 6 characters"),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const result = (0, express_validator_1.validationResult)(req);
        const errors = result.array();
        if (errors.length) {
            return res.status(403).send({ errors });
        }
        const { email, name, password } = req.body;
        const existed = yield User_1.User.findOne({ email });
        if (!!existed) {
            return res.status(403).send({ msg: constants_1.MESSAGES.userExists });
        }
        const hashedPass = bcryptjs_1.default.hashSync(password, 7);
        const data = yield User_1.User.create({
            avatar: "",
            email,
            name,
            password: hashedPass,
            role: "user",
        });
        res.status(201).send(data);
    }
    catch (error) {
        res.status(500).send({ msg: constants_1.MESSAGES.serverError });
    }
}));
exports.default = sighUpRouter;
