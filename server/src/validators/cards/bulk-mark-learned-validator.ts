import { bulkActionValidation } from "../shared";
import { bulkOwnerValidation } from "./validations";

export const bulkMarkLearnedValidator = [
  bulkActionValidation,
  bulkOwnerValidation,
];
