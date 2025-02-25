import {
  categoryValidation,
  englishValidation,
  hebrewValidation,
  priorityValidation,
  uniqueWordValidation,
} from "./validations";

export const addCardValidator = [
  categoryValidation,
  priorityValidation,
  englishValidation,
  hebrewValidation,
  uniqueWordValidation,
];
