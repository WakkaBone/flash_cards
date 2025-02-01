import { body } from "express-validator";

export const loginValidator = [
  body("username").isString().notEmpty().withMessage("Username is required"),
  body("password").isString().notEmpty().withMessage("Password is required"),
];
