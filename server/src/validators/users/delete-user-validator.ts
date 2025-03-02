import { idParamValidation, isAdminValidation } from "../shared";
import { deleteYourselfValidation } from "./validations";

export const deleteUserValidator = [
  idParamValidation,
  isAdminValidation,
  deleteYourselfValidation,
];
