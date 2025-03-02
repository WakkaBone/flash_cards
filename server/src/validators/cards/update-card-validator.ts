import { idParamValidation } from "../shared";
import {
  categoryValidation,
  englishValidation,
  hebrewValidation,
  isLearnedValidation,
  ownerValidation,
  priorityValidation,
  statisticsValidation,
} from "./validations";

export const updateCardValidator = [
  idParamValidation,
  categoryValidation,
  priorityValidation,
  hebrewValidation,
  isLearnedValidation,
  englishValidation,
  statisticsValidation,
  ownerValidation,
];
