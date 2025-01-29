import { body } from "express-validator";

export const addCardValidator = [
  body("category").isNumeric(),
  body("english").isString().notEmpty(),
  body("hebrew").isString().notEmpty(),
];
