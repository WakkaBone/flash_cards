import { body, param } from "express-validator";
import { MAIN_CATEGORIES } from "../../constants";
import { CategoriesService } from "../../services/categories-service";
import { UsersService } from "../../services/users-service";

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

export const ownerValidation = param("id").custom(
  async (categoryId, { req }) => {
    //TODO: fix type
    const userId = UsersService.getUserFromToken(req as any).id;

    const category = await CategoriesService.getCategoryById(categoryId);

    if (category.ownerIds.includes(userId)) return true;

    throw new Error("You don't have rights to update this category");
  }
);

export const bulkOwnerValidation = body("ids").custom(async (ids, { req }) => {
  //TODO: fix type
  const userId = UsersService.getUserFromToken(req as any).id;

  ids.forEach(async (id) => {
    const isMainCategory = Object.values(MAIN_CATEGORIES).includes(id);
    const category = await CategoriesService.getCategoryById(id);

    if (!isMainCategory && !category.ownerIds.includes(userId)) {
      throw new Error("You don't have rights to update this category");
    }
  });

  return true;
});
