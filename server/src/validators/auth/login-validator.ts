import {
  passwordValidation,
  userExistsValidation,
  usernameValidation,
} from "./validations";

export const loginValidator = [
  usernameValidation,
  passwordValidation,
  userExistsValidation,
];
