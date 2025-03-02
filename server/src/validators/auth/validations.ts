import { body } from "express-validator";
import { PASSWORD_RULES, USERNAME_RULES } from "../../constants";
import { UsersService } from "../../services/users-service";
import {
  passwordRulesViolatedMessage,
  usernameRulesViolatedMessage,
} from "../../utils/validation-util";

export const usernameValidation = body("username")
  .isString()
  .notEmpty()
  .withMessage("Username is required")
  .matches(USERNAME_RULES)
  .withMessage(usernameRulesViolatedMessage);

export const sharedPasswordValidation = (paramName: string) =>
  body(paramName)
    .isString()
    .notEmpty()
    .withMessage("Password is required")
    .matches(PASSWORD_RULES)
    .withMessage(passwordRulesViolatedMessage);

export const passwordValidation = sharedPasswordValidation("password");

export const optionalUsernameValidation = body("username").custom((value) => {
  if (value && value.trim() !== "") {
    if (!USERNAME_RULES.test(value))
      throw new Error(usernameRulesViolatedMessage);
  }
  return true;
});

export const optionalPasswordValidation = (paramName: string) =>
  body(paramName).custom((value) => {
    if (value && value.trim() !== "") {
      if (!PASSWORD_RULES.test(value))
        throw new Error(passwordRulesViolatedMessage);
    }
    return true;
  });

export const passwordsDifferentValidation = body("newPassword").custom(
  (newPassword, { req }) => {
    const oldPassword = req.body.oldPassword;
    if (oldPassword && newPassword && newPassword === oldPassword) {
      throw new Error("New password must be different from the old password");
    }
    return true;
  }
);

export const userExistsValidation = body("username").custom(
  async (username) => {
    const user = await UsersService.getUserByUsername(username);
    if (!user) throw new Error("User not found");
    return true;
  }
);
