import { body } from "express-validator";
import { cardIdParamValidation } from "../utils/validation-util";

export const updateCardValidator = [
  cardIdParamValidation,
  body("category").isNumeric().withMessage("Category is required"),
  body("english")
    .isString()
    .notEmpty()
    .withMessage("English translation is required"),
  body("hebrew")
    .isString()
    .notEmpty()
    .withMessage("Hebrew translation is required"),
  body("isLearned").isBoolean(),
  body("statistics").custom((value) => {
    if (
      typeof value === "object" &&
      "correct" in value &&
      "wrong" in value &&
      Number.isInteger(value.wrong) &&
      Number.isInteger(value.correct)
    ) {
      return true;
    }
    throw new Error("Invalid statistics");
  }),
];
