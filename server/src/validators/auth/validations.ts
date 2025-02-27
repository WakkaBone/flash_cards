import { body } from "express-validator";
import { PASSWORD_RULES, USERNAME_RULES } from "../../constants";
import { UsersService } from "../../services/users-service";

export const usernameValidation = body("username")
  .isString()
  .notEmpty()
  .withMessage("Username is required")
  .matches(USERNAME_RULES)
  .withMessage("Username cannot contain special chars");

export const passwordValidation = body("password")
  .isString()
  .notEmpty()
  .withMessage("Password is required")
  .matches(PASSWORD_RULES)
  .withMessage(
    "Password must be at least 8 characters long and contain both letters and numbers"
  );

export const userExistsValidation = body("username").custom(
  async (username) => {
    const user = await UsersService.getUserByUsername(username);
    if (!user) throw new Error("User not found");
    return true;
  }
);
