import { body, param } from "express-validator";
import { Priorities } from "../../models/card";
import { CardsService } from "../../services/cards-service";
import { STATISTICS_ACTIONS } from "../../constants";

export const englishValidation = body("english")
  .isString()
  .notEmpty()
  .withMessage("English translation is required");

export const hebrewValidation = body("hebrew")
  .isString()
  .notEmpty()
  .withMessage("Hebrew translation is required");

export const isLearnedValidation = body("isLearned").isBoolean();

export const categoryValidation = body("category")
  //TODO: check if such category exists and object shape
  .isObject()
  .notEmpty()
  .withMessage("Invalid category");

export const priorityValidation = body("priority")
  .isIn(Object.values(Priorities))
  .withMessage("Invalid priority");

export const statisticsValidation = body("statistics").custom((value) => {
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
});

export const uniqueWordValidation = body("english").custom(async (english) => {
  const sameWords = await CardsService.getCards({
    searchExact: english,
  });

  if (sameWords.length > 0) throw new Error("Such word already exists");

  return true;
});

export const actionValidator = param("action")
  .isIn(Object.values(STATISTICS_ACTIONS))
  .withMessage("Invalid action");
