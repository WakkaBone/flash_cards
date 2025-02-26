import { idParamValidation } from "../shared";
import {
  categoryNameValidation,
  mainCategoryParamValidation,
  ownerValidation,
} from "./validations";

export const updateCategoryValidator = [
  idParamValidation,
  mainCategoryParamValidation,
  categoryNameValidation,
  ownerValidation,
];
