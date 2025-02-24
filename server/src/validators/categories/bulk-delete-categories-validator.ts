import { body } from "express-validator";
import { bulkActionValidation } from "../../utils/validation-util";
import { MAIN_CATEGORIES } from "../../constants";

export const bulkDeleteCategoriesValidator = [
  bulkActionValidation,
  body("ids").custom((ids) => {
    const mainCategories = Object.values(MAIN_CATEGORIES);
    const canDelete = ids.every((id) => !mainCategories.includes(id));
    if (canDelete) return true;
    throw new Error("Cannot remove one of the main categories");
  }),
];
