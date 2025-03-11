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
const express_1 = __importDefault(require("express"));
const mongoose_1 = __importDefault(require("mongoose"));
const dotenv_1 = __importDefault(require("dotenv"));
const body_parser_1 = __importDefault(require("body-parser"));
const cors_1 = __importDefault(require("cors"));
const TransactionRoute_1 = __importDefault(require("./routes/TransactionRoute"));
const budgetRouter_1 = __importDefault(require("./routes/budgetRouter"));
const potRouter_1 = __importDefault(require("./routes/potRouter"));
const authRouter_1 = __importDefault(require("./routes/authRouter"));
const signUpRouter_1 = __importDefault(require("./routes/signUpRouter"));
const UserRoute_1 = __importDefault(require("./routes/UserRoute"));
const middleware_1 = require("./middleware");
const dbRouter_1 = __importDefault(require("./routes/dbRouter"));
const tokenRouter_1 = __importDefault(require("./routes/tokenRouter"));
// Server settings
dotenv_1.default.config();
const server = (0, express_1.default)();
const PORT = process.env.PORT || 8000;
server.set("json spaces", 2);
server.use(body_parser_1.default.json());
server.use((0, cors_1.default)());
const verifyToken = new middleware_1.VerifyToken();
// Main route
server.get("/", (__, res) => {
    res.sendFile(__dirname + "/index.html");
});
// Routes
server.use("/api/transactions", verifyToken.userAccess, TransactionRoute_1.default);
server.use("/api/budgets", verifyToken.userAccess, budgetRouter_1.default);
server.use("/api/pots", verifyToken.userAccess, potRouter_1.default);
server.use("/api/users", verifyToken.adminAccess, UserRoute_1.default);
server.use("/api/signup", signUpRouter_1.default);
server.use("/api/login", authRouter_1.default);
server.use("/api/clear", verifyToken.adminAccess, dbRouter_1.default);
server.use("/api/token", verifyToken.userAccess, tokenRouter_1.default);
// Running server
server.listen(PORT, () => __awaiter(void 0, void 0, void 0, function* () {
    console.log(`Server is running at http://localhost:${PORT}`);
    yield mongoose_1.default.connect(`mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.s9jj6.mongodb.net/`, {
        dbName: "finances",
    });
}));
