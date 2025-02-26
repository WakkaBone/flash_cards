import { idParamValidation } from "../shared";
import { ownerValidation } from "./validations";

export const deleteCardValidator = [idParamValidation, ownerValidation];
