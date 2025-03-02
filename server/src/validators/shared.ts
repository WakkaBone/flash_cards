import { NextFunction, Request, Response } from "express";
import { body, param } from "express-validator";
import { ACCESS_TOKEN_KEY } from "../constants";
import { UsersService } from "../services/users-service";
import { isAdmin } from "../utils/roles-util";

export const idParamValidation = param("id")
  .isString()
  .notEmpty()
  .withMessage("ID is required");

export const bulkActionValidation = body("ids")
  .isArray()
  .custom((value) => Array.isArray(value) && value.length > 0)
  .withMessage("IDs are required");

export const isAdminValidation = (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const user = UsersService.getUserFromToken(req);
  if (isAdmin(user)) return next();
  else
    res.status(403).json({ isSuccess: false, error: { message: "Forbidden" } });
};
