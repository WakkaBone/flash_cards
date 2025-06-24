import { body, param } from "express-validator";
import { Priorities } from "../../models/card";
import { CardsService } from "../../services/cards-service";
import { STATISTICS_ACTIONS } from "../../constants";
import { UsersService } from "../../services/users-service";
import { isAdmin } from "../../utils/roles-util";

const HEBREW_REGEX = /^[\u0590-\u05FF\s]+$/;
const ENGLISH_REGEX = /^[A-Za-z\s]+$/;

export const isHebrew = (string: string) => HEBREW_REGEX.test(string);
export const isEnglish = (string: string) => ENGLISH_REGEX.test(string);

export const englishValidation = body("english")
  .isString()
  .notEmpty()
  .withMessage("English translation is required")
  .custom((value) => {
    if (!isEnglish(value)) {
      throw new Error(
        "English translation must contain only English letters and spaces"
      );
    }
    return true;
  });

export const hebrewValidation = body("hebrew")
  .isString()
  .notEmpty()
  .withMessage("Hebrew translation is required")
  .custom((value) => {
    if (!isHebrew(value)) {
      throw new Error(
        "Hebrew translation must contain only Hebrew letters and spaces"
      );
    }
    return true;
  });

export const isLearnedValidation = body("isLearned").isBoolean();

export const categoryIdValidation = body("category")
  //TODO: check if such category exists and object shape
  .isString()
  .notEmpty()
  .withMessage("Invalid category");

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

export const uniqueWordValidation = body("english").custom(
  async (english, { req }) => {
    //TODO: fix type
    const userId = UsersService.getUserFromToken(req as any).id;

    const sameWords = await CardsService.getCards({
      ownerId: userId,
      searchExact: english,
    });

    if (sameWords.length > 0) throw new Error("Such word already exists");

    return true;
  }
);

export const actionValidator = param("action")
  .isIn(Object.values(STATISTICS_ACTIONS))
  .withMessage("Invalid action");

export const ownerValidation = param("id").custom(async (cardId, { req }) => {
  //TODO: fix type
  const user = UsersService.getUserFromToken(req as any);

  if (isAdmin(user)) return true;

  const card = await CardsService.getCardById(cardId);

  if (card.ownerIds.includes(user.id)) return true;

  throw new Error("You don't have rights to update this card");
});

export const bulkOwnerValidation = body("ids").custom(async (ids, { req }) => {
  //TODO: fix type
  const user = UsersService.getUserFromToken(req as any);

  if (isAdmin(user)) return true;

  ids.forEach(async (id) => {
    const card = await CardsService.getCardById(id);

    if (!card.ownerIds.includes(user.id))
      throw new Error("You don't have rights to update this card");
  });

  return true;
});

export const infinitiveValidation = param("infinitive")
  .isString()
  .notEmpty()
  .withMessage("Infinitive is required")
  .custom((value) => {
    if (!isHebrew(value)) {
      throw new Error(
        "Verb infinitive must contain only Hebrew letters and spaces"
      );
    }
    return true;
  });
