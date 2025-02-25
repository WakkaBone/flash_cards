import { idParamValidation } from "../shared";
import {
  categoryValidation,
  englishValidation,
  hebrewValidation,
  isLearnedValidation,
  priorityValidation,
  statisticsValidation,
  uniqueWordValidation,
} from "./validations";

export const updateCardValidator = [
  idParamValidation,
  categoryValidation,
  priorityValidation,
  hebrewValidation,
  isLearnedValidation,
  englishValidation,
  statisticsValidation,
  uniqueWordValidation,
];
