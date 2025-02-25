import { body, param } from "express-validator";
import { MAIN_CATEGORIES } from "../../constants";
import { CategoriesService } from "../../services/categories-service";

export const mainCategoryParamValidation = param("id").custom((value) => {
  const mainCategories = Object.values(MAIN_CATEGORIES);
  if (!mainCategories.includes(value)) return true;
  throw new Error("Main categories are readonly");
});

export const mainCategoryBodyValidation = body("ids").custom((ids) => {
  const mainCategories = Object.values(MAIN_CATEGORIES);
  const canDelete = ids.every((id) => !mainCategories.includes(id));
  if (canDelete) return true;
  throw new Error("Cannot remove one of the main categories");
});

export const categoryNameValidation = body("label")
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
  });
