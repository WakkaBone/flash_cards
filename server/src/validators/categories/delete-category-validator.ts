import { MAIN_CATEGORIES } from "../../constants";
import { idParamValidation } from "../../utils/validation-util";
import { param } from "express-validator";

export const deleteCategoryValidator = [
  idParamValidation,
  param("id").custom((value) => {
    const mainCategories = Object.values(MAIN_CATEGORIES);
    if (!mainCategories.includes(value)) return true;
    throw new Error("Cannot remove one of the main categories");
  }),
];
