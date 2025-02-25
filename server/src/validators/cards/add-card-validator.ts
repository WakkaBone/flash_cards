import {
  categoryIdValidation,
  englishValidation,
  hebrewValidation,
  priorityValidation,
  uniqueWordValidation,
} from "./validations";

export const addCardValidator = [
  categoryIdValidation,
  priorityValidation,
  englishValidation,
  hebrewValidation,
  uniqueWordValidation,
];
