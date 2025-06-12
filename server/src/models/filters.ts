import { STATISTICS_ACTIONS } from "../constants";
import { Priorities } from "./card";
import { DateRange } from "./shared";
import { Roles } from "./user";

export type GetCardsFilters = DateRange & {
  category?: string;
  search?: string;
  searchExact?: string;
  includeLearned?: boolean;
  mistakesThreshold?: number;
  priority?: Priorities;
  page?: number;
  pageSize?: number;
  ownerId?: string;
  lastCards?: number;
};

export type GetPracticeTimelineFilters = DateRange & {
  action?: STATISTICS_ACTIONS;
};

export type GetUsersFilters = DateRange & {
  search?: string;
  searchExact?: string;
  role?: Roles;
  numberOfCards?: number;
  longestStreak?: number;
  currentStreak?: number;
  page?: number;
  pageSize?: number;
};

export type GetCategoriesFilters = DateRange & {
  search?: string;
  searchExact?: string;
  numberOfCards?: number;
  page?: number;
  pageSize?: number;
  ownerId?: string;
};
