import { uniqueUsernameValidation } from "../users/validations";
import { passwordValidation, usernameValidation } from "./validations";

export const signupValidator = [
  usernameValidation,
  passwordValidation,
  uniqueUsernameValidation(true),
];
