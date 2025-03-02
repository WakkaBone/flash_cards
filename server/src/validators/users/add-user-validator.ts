import { isAdminValidation } from "../shared";
import {
  usernameValidation,
  passwordValidation,
  roleValidation,
  uniqueUsernameValidation,
} from "./validations";

export const addUserValidator = [
  usernameValidation,
  passwordValidation,
  roleValidation,
  uniqueUsernameValidation(true),
  isAdminValidation,
];
