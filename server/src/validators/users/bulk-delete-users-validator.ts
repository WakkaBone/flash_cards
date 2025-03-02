import { bulkActionValidation, isAdminValidation } from "../shared";
import { bulkDeleteYourselfValidation } from "./validations";

export const bulkDeleteUsersValidator = [
  bulkActionValidation,
  isAdminValidation,
  bulkDeleteYourselfValidation,
];
