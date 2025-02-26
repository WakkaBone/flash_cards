export const APIS = {
  auth: "auth",
  cards: "cards",
  categories: "categories",
  users: "users",
  version: "version",
};

export const COLLECTIONS = {
  users: "users",
  cards: "cards",
  categories: "categories",
};

export enum STATISTICS_ACTIONS {
  Correct = "correct",
  Wrong = "wrong",
}

export const MAIN_CATEGORIES = {
  noun: "1",
  adjective: "2",
  verb: "3",
  other: "4",
};

export const ACCESS_TOKEN_KEY = "access_token";
export const REFRESH_TOKEN_KEY = "refresh_token";

export const MIN_EASE_COEFFICIENT = 1.3;
export const MAX_EASE_COEFFICIENT = 2.5;

export const PASSWORD_RULES = /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d]{8,}$/;
