import { idParamValidation, isAdminValidation } from "../shared";

export const deleteUserValidator = [idParamValidation, isAdminValidation];
