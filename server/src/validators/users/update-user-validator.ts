import { isAdminValidation } from "../shared";
import {
  usernameValidation,
  roleValidation,
  uniqueUsernameValidation,
} from "./validations";

export const updateUserValidator = [
  usernameValidation,
  roleValidation,
  uniqueUsernameValidation(true),
  isAdminValidation,
];
