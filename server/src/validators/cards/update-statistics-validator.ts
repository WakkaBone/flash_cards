import { idParamValidation } from "../shared";
import { actionValidator } from "./validations";

export const updateStatisticsValidator = [idParamValidation, actionValidator];
