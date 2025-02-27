import { body, param } from "express-validator";
import { Roles } from "../../models/user";
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

export const roleValidation = body("role")
  .isIn(Object.values(Roles))
  .withMessage("Invalid role");

export const uniqueUsernameValidation = body("username").custom(
  async (username) => {
    const sameUsernames = await UsersService.getUsers({
      searchExact: username,
    });

    if (sameUsernames.length > 0)
      throw new Error("Such username already exists");

    return true;
  }
);

export const deleteYourselfValidation = param("id").custom(
  async (userId, { req }) => {
    //TODO: fix type
    const user = UsersService.getUserFromToken(req as any);
    if (user.id !== userId) throw new Error("You can't delete yourself");
    return true;
  }
);

export const bulkDeleteYourselfValidation = body("ids").custom(
  async (ids, { req }) => {
    //TODO: fix type
    const user = UsersService.getUserFromToken(req as any);
    if (ids.includes(user.id)) throw new Error("You can't delete yourself");
    return true;
  }
);
