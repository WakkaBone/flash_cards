import { body } from "express-validator";
import { CardsService } from "../../services/cards-service";

export const addCardValidator = [
  body("category").isNumeric().withMessage("Category is required"),
  body("english")
    .isString()
    .notEmpty()
    .withMessage("English translation is required")
    .custom(async (english) => {
      const sameWords = await CardsService.getCards({
        searchExact: english,
      });

      if (sameWords.length > 0) throw new Error("Such word already exists");

      return true;
    }),

  body("hebrew")
    .isString()
    .notEmpty()
    .withMessage("Hebrew translation is required"),
];
