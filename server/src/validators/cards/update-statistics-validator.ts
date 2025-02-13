import { param } from "express-validator";
import { STATISTICS_ACTIONS } from "../../constants";
import { idParamValidation } from "../../utils/validation-util";

export const updateStatisticsValidator = [
  idParamValidation,
  param("action")
    .isString()
    .isIn(Object.values(STATISTICS_ACTIONS))
    .withMessage("Invalid action"),
];
