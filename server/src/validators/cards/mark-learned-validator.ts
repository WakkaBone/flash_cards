import { idParamValidation } from "../shared";
import { ownerValidation } from "./validations";

export const markLearnedValidator = [idParamValidation, ownerValidation];
