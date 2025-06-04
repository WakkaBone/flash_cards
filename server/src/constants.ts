export const APIS = {
  auth: "auth",
  cards: "cards",
  statistics: "statistics",
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

export const accessTokenDuration = 600; //10 minutes
export const refreshTokenDuration = 43200; //12 hours

export const MIN_EASE_COEFFICIENT = 1.3;
export const MAX_EASE_COEFFICIENT = 2.5;

export const PASSWORD_RULES =
  /^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d!@#$%^&*()_+={}\[\]:;"'<>,.?/\\|`~\-]{8,}$/;
export const USERNAME_RULES = /^[A-Za-z0-9]+$/;

export const CSV_FIELD_NAMES = {
  english: "English",
  hebrew: "Hebrew",
  category: "Category",
  details: "Details",
  priority: "Priority",
  isLearned: "Is Learned",
};
