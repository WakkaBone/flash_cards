import { query } from "express-validator";
import { Categories } from "../models/card";

export const getCardsValidator = [
  query("category")
    .optional()
    .isNumeric()
    .isIn(Object.values(Categories))
    .withMessage("Invalid category"),
];
