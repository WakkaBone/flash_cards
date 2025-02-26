import { idParamValidation } from "../shared";
import { mainCategoryParamValidation, ownerValidation } from "./validations";

export const deleteCategoryValidator = [
  idParamValidation,
  mainCategoryParamValidation,
  ownerValidation,
];
