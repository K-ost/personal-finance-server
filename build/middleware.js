"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VerifyToken = exports.TOKEN_KEY = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
const constants_1 = require("./constants");
const utils_1 = require("./utils");
dotenv_1.default.config();
exports.TOKEN_KEY = process.env.JWT_KEY;
const verifyToken = (req, res, next, role) => {
    const token = (0, utils_1.getToken)(req);
    if (!token)
        res.status(401).send({ msg: constants_1.MESSAGES.token.accessDenied });
    if (token && exports.TOKEN_KEY) {
        jsonwebtoken_1.default.verify(token, exports.TOKEN_KEY, (err, decoded) => {
            if (err) {
                res.sendStatus(401);
                return;
            }
            req.userId = decoded.userId;
            if (role === "admin" && decoded.role !== "admin") {
                res.status(401).send({ msg: constants_1.MESSAGES.token.adminOnly });
                return;
            }
            next();
        });
    }
};
class VerifyToken {
    userAccess(req, res, next) {
        verifyToken(req, res, next, "user");
    }
    adminAccess(req, res, next) {
        verifyToken(req, res, next, "admin");
    }
}
exports.VerifyToken = VerifyToken;
