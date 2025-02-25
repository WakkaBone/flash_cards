import { CardModel, Priorities } from "./card";
import { CategoryModel } from "./category";
import { IdLabel } from "./shared";

export interface ApiError<T = any> {
  message?: string;
  code?: string;
  data?: T;
}

export interface ApiResponse<T = any, E = any> {
  isSuccess: boolean;
  data?: T;
  error?: ApiError<E>;
}

enum AllOption {
  All = 0,
}
export type PrioritiesExtended = Priorities | AllOption;

export type GetCardsFilters = {
  category?: IdLabel | null;
  search?: string;
  includeLearned?: boolean;
  mistakesThreshold?: string;
  from?: Date;
  to?: Date;
  priority?: PrioritiesExtended;
  page?: number;
  pageSize?: number;
};

export type GetCategoriesFilters = {
  search?: string;
  from?: Date;
  to?: Date;
  numberOfCards?: string;
  page?: number;
  pageSize?: number;
};

export type GetPracticeTimelineFilters = {
  action?: STATISTICS_ACTIONS;
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

export type BulkDeleteSharedPayload = { ids: string[] };
export type BulkDeleteCardsPayload = BulkDeleteSharedPayload;
export type BulkMarkLearnedPayload = BulkDeleteSharedPayload;
export type BulkDeleteCategoriesPayload = BulkDeleteSharedPayload;

export type LoginPayload = {
  username: string;
  password: string;
};
