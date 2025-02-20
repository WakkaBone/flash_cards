import { body } from "express-validator";
import { idParamValidation } from "../../utils/validation-util";
import { CardsService } from "../../services/cards-service";

export const updateCardValidator = [
  idParamValidation,
  body("category").isObject().notEmpty().withMessage("Category is required"),
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
