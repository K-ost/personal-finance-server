export const PAGE_COUNT = 10;

export const MESSAGES = {
  serverError: "Server error",
  entityExists: "Entity with this already exists",
  entityAdded: "The entity has been added",
  entityEdited: "The entity has been edited",
  entityDeleted: "The entity has been deleted",
  emailIncorrect: "Incorrect email",
  passIncorrect: "Incorrect password",
  defaultEntity:
    "This entity either does not exist or is a default and cannot be modified or deleted. Try creating a new one.",
  noUser: "User with this e-mail doesn't exist",
  userRegistered: "User has been registered",
  auth: {
    noAuth: "No authorization",
    noToken: "Invalid token",
  },
};

export const OPTIONS = {
  refreshAge: 1 * 24 * 60 * 60 * 1000,
};
