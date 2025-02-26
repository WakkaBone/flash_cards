import { bulkActionValidation } from "../shared";
import { bulkOwnerValidation, mainCategoryBodyValidation } from "./validations";

export const bulkDeleteCategoriesValidator = [
  bulkActionValidation,
  mainCategoryBodyValidation,
  bulkOwnerValidation,
];
