import { Categories } from "../models/card";

export const categoryMapper: Record<Categories, string> = {
  [Categories.Noun]: "Noun",
  [Categories.Adjective]: "Adjective",
  [Categories.Verb]: "Verb",
  [Categories.Other]: "Other",
};
