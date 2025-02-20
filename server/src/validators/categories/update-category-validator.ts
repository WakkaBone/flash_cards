import { body, param } from "express-validator";
import { CategoriesService } from "../../services/categories-service";
import { idParamValidation } from "../../utils/validation-util";
import { MAIN_CATEGORIES } from "../../constants";

export const updateCategoryValidator = [
  idParamValidation,
  param("id").custom((value) => {
    const mainCategories = Object.values(MAIN_CATEGORIES);
    if (!mainCategories.includes(value)) return true;
    throw new Error("Cannot update one of the main categories");
  }),
  body("label")
    .isString()
    .notEmpty()
    .withMessage("Category name is required")
    .custom(async (name) => {
      const sameCategories = await CategoriesService.getCategories({
        searchExact: name,
      });

      if (sameCategories.length > 0) {
        throw new Error("Such category already exists");
      }

      return true;
    }),
];
