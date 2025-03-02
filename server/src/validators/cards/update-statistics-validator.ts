import { idParamValidation } from "../shared";
import { actionValidator, ownerValidation } from "./validations";

export const updateStatisticsValidator = [
  idParamValidation,
  actionValidator,
  ownerValidation,
];
