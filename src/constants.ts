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
};
