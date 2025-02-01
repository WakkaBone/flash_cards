import { Categories } from "../models/card";
import { PracticeModes } from "../pages/practice-page";

export const categoryMapper: Record<Categories, string> = {
  [Categories.Noun]: "Noun",
  [Categories.Adjective]: "Adjective",
  [Categories.Verb]: "Verb",
  [Categories.Other]: "Other",
};

export const practiceModeMapper: Record<PracticeModes, string> = {
  [PracticeModes.eth]: "English to Hebrew",
  [PracticeModes.hte]: "Hebrew to English",
  [PracticeModes.browse]: "Browse",
};
