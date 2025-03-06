export const PAGE_COUNT = 20;
export const TOKEN_KEY = process.env.JWT_KEY || "TOKEN_JWT";

export const FORBIDDEN_USER_IDS = [
  "67c696b7d7669c26105a3487",
  "67c728a3240f539a39e44ff7",
];

export const MESSAGES = {
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
  },
};
