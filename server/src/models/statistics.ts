import { Priorities } from "./card";
import { DateRange, CounterByDate } from "./shared";
import { Roles } from "./user";

export type Statistics = {
  totalCards: number;
  totalLearnedCards: number;
  lastAdded: string;
  mostMistakes: string;
  currentStreak: number;
  longestStreak: number;
  lastPractice: string;
};

export type StatisticsAdmin = {
  totalCards: number;
  totalLearnedCards: number;
  lastAdded: string;
  mostMistakes: string;
  totalUsers: number;
  longestActiveStreak: string;
  longestStreak: string;
  lastPractice: string;
};

export type GetUserDynamicsFilters = DateRange & {
  role?: Roles;
};

export type GetCardDynamicsFilters = DateRange & {
  priority?: Priorities;
};

export type GetUsersDynamicsDto = {
  createdAt: CounterByDate;
  lastPractice: CounterByDate;
};

export type GetCardsDynamicsDto = GetUsersDynamicsDto;
