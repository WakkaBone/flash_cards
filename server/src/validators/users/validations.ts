import { body } from "express-validator";
import { Roles } from "../../models/user";
import { PASSWORD_RULES } from "../../constants";

export const usernameValidation = body("username")
  .isString()
  .notEmpty()
  .withMessage("Username is required");

export const passwordValidation = body("password")
  .isString()
  .notEmpty()
  .withMessage("Password is required")
  .matches(PASSWORD_RULES)
  .withMessage(
    "Password must be at least 8 characters long and contain both letters and numbers"
  );

export const roleValidation = body("role")
  .isIn(Object.values(Roles))
  .withMessage("Invalid role");
