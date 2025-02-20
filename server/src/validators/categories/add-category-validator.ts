import { body } from "express-validator";
import { CategoriesService } from "../../services/categories-service";

export const addCategoryValidator = [
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
