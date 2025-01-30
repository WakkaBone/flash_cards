import { Request, Response } from "express";
import { param, validationResult } from "express-validator";

export const cardIdParamValidation = param("id")
  .isString()
  .notEmpty()
  .withMessage("Card ID is required");

export const isValid = (req: Request, res: Response) => {
  const result = validationResult(req);
  if (result.isEmpty()) return true;
  res.json({
    isSuccess: false,
    error: {
      code: "ValidationError",
      message: "Validation error",
      data: result.array(),
    },
  });
  return false;
};
