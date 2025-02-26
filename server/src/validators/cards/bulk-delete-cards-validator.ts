import { bulkActionValidation } from "../shared";
import { bulkOwnerValidation } from "./validations";

export const bulkDeleteCardsValidator = [
  bulkActionValidation,
  bulkOwnerValidation,
];
