import {
  PrioritiesExtended,
  RolesExtended,
  StatisticsActionTypeExtended,
} from "./api";
import { DateRange, IdLabel } from "./shared";

export type GetCardsFilters = DateRange & {
  ownerId?: string;
  category?: IdLabel | null;
  search?: string;
  includeLearned?: boolean;
  mistakesThreshold?: string;
  priority?: PrioritiesExtended;
  page?: number;
  pageSize?: number;
  lastCards?: number;
};

export type GetCategoriesFilters = DateRange & {
  search?: string;
  numberOfCards?: string;
  page?: number;
  pageSize?: number;
};

export type GetPracticeTimelineFilters = DateRange & {
  action?: StatisticsActionTypeExtended;
};

export type GetUsersFilters = DateRange & {
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

export type GetUserDynamicsFilters = DateRange & {
  role?: RolesExtended;
};

export type GetCardDynamicsFilters = DateRange & {
  priority?: PrioritiesExtended;
};

export type PracticeFilersType = Omit<GetCardsFilters, "search">;
