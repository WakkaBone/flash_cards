import { idParamValidation } from "../shared";
import { mainCategoryParamValidation } from "./validations";

export const deleteCategoryValidator = [
  idParamValidation,
  mainCategoryParamValidation,
];
