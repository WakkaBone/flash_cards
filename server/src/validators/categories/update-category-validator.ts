import { idParamValidation } from "../shared";
import {
  categoryNameValidation,
  mainCategoryParamValidation,
} from "./validations";

export const updateCategoryValidator = [
  idParamValidation,
  mainCategoryParamValidation,
  categoryNameValidation,
];
