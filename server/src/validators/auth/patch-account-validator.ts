import { uniqueUsernameValidation } from "../users/validations";
import {
  optionalPasswordValidation,
  optionalUsernameValidation,
  passwordsDifferentValidation,
} from "./validations";

export const patchAccountValidator = [
  optionalUsernameValidation,
  uniqueUsernameValidation(false),
  optionalPasswordValidation("oldPassword"),
  optionalPasswordValidation("newPassword"),
  passwordsDifferentValidation,
];
