import { StatisticsActionTypeExtended } from "../hooks/use-practice-timeline-filters";
import { CardModel, Priorities } from "./card";
import { CategoryModel } from "./category";
import { AllOptionInt, AllOptionString, IdLabel } from "./shared";
import { Roles, UserModel } from "./user";

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

export type PrioritiesExtended = Priorities | AllOptionInt;
export type RolesExtended = Roles | AllOptionString;

export type GetCardsFilters = {
  ownerId?: string;
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
  action?: StatisticsActionTypeExtended;
  from?: Date;
  to?: Date;
};

export type GetUsersFilters = {
  search?: string;
  searchExact?: string;
  role?: RolesExtended;
  numberOfCards?: string;
  from?: Date;
  to?: Date;
  longestStreak?: string;
  currentStreak?: string;
  page?: number;
  pageSize?: number;
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

export type AddUserPayload = {
  username: string;
  password: string;
  role: Roles;
};

export type UpdateCardPayload = CardModel;
export type UpdateCategoryPayload = CategoryModel;
export type UpdateUserPayload = UserModel;

export type BulkDeleteSharedPayload = { ids: string[] };
export type BulkDeleteCardsPayload = BulkDeleteSharedPayload;
export type BulkMarkLearnedPayload = BulkDeleteSharedPayload;
export type BulkDeleteCategoriesPayload = BulkDeleteSharedPayload;
export type BulkDeleteUsersPayload = BulkDeleteSharedPayload;

export type LoginPayload = {
  username: string;
  password: string;
};

export type SignupPayload = LoginPayload;

export type AuthUserModel = {
  id: string;
  username: string;
  role: Roles;
};
