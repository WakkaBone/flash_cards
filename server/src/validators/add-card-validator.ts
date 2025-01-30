import { body } from "express-validator";

export const addCardValidator = [
  body("category").isNumeric().withMessage("Category is required"),
  body("english")
    .isString()
    .notEmpty()
    .withMessage("English translation is required"),
  body("hebrew")
    .isString()
    .notEmpty()
    .withMessage("Hebrew translation is required"),
];
