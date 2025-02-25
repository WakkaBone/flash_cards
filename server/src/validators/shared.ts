import { body, param } from "express-validator";

export const idParamValidation = param("id")
  .isString()
  .notEmpty()
  .withMessage("ID is required");

export const bulkActionValidation = body("ids")
  .isArray()
  .custom((value) => Array.isArray(value) && value.length > 0)
  .withMessage("IDs are required");
