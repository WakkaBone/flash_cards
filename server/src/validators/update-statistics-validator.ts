import { param } from "express-validator";
import { STATISTICS_ACTIONS } from "../constants";
import { cardIdParamValidation } from "../utils/validation-util";

export const updateStatisticsValidator = [
  cardIdParamValidation,
  param("action")
    .isString()
    .isIn(Object.values(STATISTICS_ACTIONS))
    .withMessage("Invalid action"),
];
