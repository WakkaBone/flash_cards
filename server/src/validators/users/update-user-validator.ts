import {
  usernameValidation,
  roleValidation,
  uniqueUsernameValidation,
} from "./validations";

export const updateUserValidator = [
  usernameValidation,
  roleValidation,
  uniqueUsernameValidation,
];
