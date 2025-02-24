import { Request, Response } from "express";
import { body, param, validationResult } from "express-validator";

export const idParamValidation = param("id")
  .isString()
  .notEmpty()
  .withMessage("ID is required");

export const bulkActionValidation = body("ids")
  .isArray()
  .custom((value) => Array.isArray(value) && value.length > 0)
  .withMessage("IDs are required");

export const isValid = (req: Request, res: Response) => {
  const result = validationResult(req);
  if (result.isEmpty()) return true;
  res.status(400).json({
    isSuccess: false,
    error: {
      code: "ValidationError",
      message: "Validation error",
      data: result.array(),
    },
  });
  return false;
};
