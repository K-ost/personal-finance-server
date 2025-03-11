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
exports.RequestController = void 0;
const constants_1 = require("./constants");
const Pot_1 = require("./schemas/Pot");
const Budget_1 = require("./schemas/Budget");
const User_1 = require("./schemas/User");
class RequestController {
    getCurrentPage(pageCount, page) {
        const current = page || 1;
        return pageCount * (current - 1);
    }
    getFilters(req) {
        const filter = Object.assign({}, req.query);
        if (filter.hasOwnProperty("page")) {
            delete filter.page;
        }
        if (filter.hasOwnProperty("q")) {
            delete filter.q;
        }
        if (filter.hasOwnProperty("sort")) {
            delete filter.sort;
        }
        if (filter.hasOwnProperty("limit")) {
            delete filter.limit;
        }
        return filter;
    }
    getUserIdFilter(url, userId) {
        return url === "/api/transactions" || url === "/api/users" ? {} : { userId };
    }
    getTransactions(req, res, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const limit = req.query.limit ? Number(req.query.limit) : constants_1.PAGE_COUNT;
                const sort = `field ${req.query.sort ? req.query.sort : "-date"}`;
                const skip = this.getCurrentPage(limit, Number(req.query.page) || 1);
                const filter = this.getFilters(req);
                const userIdFilter = this.getUserIdFilter(req.baseUrl, req.userId);
                const length = (yield model.find(userIdFilter)).length;
                // Search
                let re = new RegExp(String(req.query.q), "i");
                const searchFilter = req.query.q ? { name: re } : {};
                const data = yield model
                    .find(Object.assign(Object.assign(Object.assign({}, filter), userIdFilter), searchFilter))
                    .sort(sort)
                    .skip(skip)
                    .limit(limit);
                res.status(200).send({
                    data,
                    count: filter.category || req.query.q ? data.length : length,
                    page: Number(req.query.page) || 1,
                    msg: "Ok",
                });
            }
            catch (error) {
                res.send({ msg: constants_1.MESSAGES.serverError });
            }
        });
    }
    getData(req, res, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = this.getUserIdFilter(req.baseUrl, req.userId);
                const data = yield model.find(filter);
                res.status(200).send(data);
            }
            catch (error) {
                res.send({ msg: constants_1.MESSAGES.serverError });
            }
        });
    }
    getBudgets(req, res, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield model.aggregate([
                    {
                        $match: { userId: req.userId },
                    },
                    {
                        $lookup: {
                            from: "transactions",
                            localField: "category",
                            foreignField: "category",
                            as: "latest",
                            pipeline: [{ $limit: 3 }],
                        },
                    },
                ]);
                res.status(200).send(data);
            }
            catch (error) {
                res.send({ msg: constants_1.MESSAGES.serverError });
            }
        });
    }
    postData(req, res, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield model.create(req.body);
                res.send({ data, msg: constants_1.MESSAGES.entityAdded });
            }
            catch (error) {
                res.send({ msg: constants_1.MESSAGES.serverError });
            }
        });
    }
    editData(req, res, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const data = yield model.findByIdAndUpdate(req.params.id, req.body, {
                    new: true,
                });
                res.status(201).send({ data: data, msg: constants_1.MESSAGES.entityEdited });
            }
            catch (error) {
                res.send({ msg: constants_1.MESSAGES.serverError });
            }
        });
    }
    deleteData(req, res, model) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                yield model.deleteOne({ _id: req.params.id });
                res.send({ msg: constants_1.MESSAGES.entityDeleted });
            }
            catch (error) {
                res.send({ msg: constants_1.MESSAGES.serverError });
            }
        });
    }
    clearAll(res) {
        return __awaiter(this, void 0, void 0, function* () {
            try {
                const filter = { $nin: constants_1.FORBIDDEN_USER_IDS };
                yield Budget_1.Budget.deleteMany({ userId: filter });
                yield Pot_1.Pot.deleteMany({ userId: filter });
                yield User_1.User.deleteMany({ _id: filter });
                res.send({ msg: constants_1.MESSAGES.dbCleaned });
            }
            catch (error) {
                res.send({ msg: constants_1.MESSAGES.serverError });
            }
        });
    }
}
exports.RequestController = RequestController;
