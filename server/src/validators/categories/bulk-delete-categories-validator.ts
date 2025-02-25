import { bulkActionValidation } from "../shared";
import { mainCategoryBodyValidation } from "./validations";

export const bulkDeleteCategoriesValidator = [
  bulkActionValidation,
  mainCategoryBodyValidation,
];
