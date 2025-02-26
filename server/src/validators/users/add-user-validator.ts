import {
  usernameValidation,
  passwordValidation,
  roleValidation,
} from "./validations";

export const addUserValidator = [
  usernameValidation,
  passwordValidation,
  roleValidation,
];
