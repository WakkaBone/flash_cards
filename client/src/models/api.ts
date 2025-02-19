import { CardModel } from "./card";
import { CategoryModel } from "./category";
import { IdLabel } from "./shared";

export interface ApiError<T = any> {
  message?: string;
  code?: string;
  data?: T;
}

export interface ApiResponse<T = any> {
  isSuccess: boolean;
  data?: T;
  error?: ApiError;
}

export type GetCardsFilters = {
  category?: IdLabel | null;
  search?: string;
  includeLearned?: boolean;
  mistakesThreshold?: string;
  from?: Date;
  to?: Date;
};

export type GetCategoriesFilters = {
  search?: string;
  numberOfCards?: string;
  from?: Date;
  to?: Date;
};

export enum STATISTICS_ACTIONS {
  Correct = "correct",
  Wrong = "wrong",
}

export type AddCardPayload = {
  category: string;
  english: string;
  hebrew: string;
  details?: string;
};

export type AddCategoryPayload = {
  label: string;
};

export type UpdateCardPayload = CardModel;
export type UpdateCategoryPayload = CategoryModel;

export type LoginPayload = {
  username: string;
  password: string;
};
