import { Request, Response } from "express";
import { validationResult } from "express-validator";

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
