"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MESSAGES = exports.FORBIDDEN_USER_IDS = exports.TOKEN_TIME = exports.PAGE_COUNT = void 0;
exports.PAGE_COUNT = 10;
exports.TOKEN_TIME = "30m";
exports.FORBIDDEN_USER_IDS = [
    "67c696b7d7669c26105a3487",
    "67c728a3240f539a39e44ff7",
];
exports.MESSAGES = {
    serverError: "Server error",
    entityExists: "Entity with this already exists",
    userExists: "User already exists",
    entityAdded: "The entity has been added",
    entityEdited: "The entity has been edited",
    entityDeleted: "The entity has been deleted",
    dbCleaned: "Database has been cleaned",
    token: {
        accessDenied: "Access denied",
        invalid: "Invalid token",
        adminOnly: "Only for admin",
        relevant: "Token is relevant",
    },
};
