import { STATISTICS_ACTIONS } from "./api";

export enum StatisticsCounters {
  totalCards = "totalCards",
  totalLearnedCards = "totalLearnedCards",
  currentStreak = "currentStreak",
  longestStreak = "longestStreak",
  lastPractice = "lastPractice",
  lastAdded = "lastAdded",
  mostMistakes = "mostMistakes",
}

export enum StatisticsCountersAdmin {
  totalCards = "totalCards",
  totalLearnedCards = "totalLearnedCards",
  longestStreak = "longestStreak",
  longestActiveStreak = "longestActiveStreak",
  lastPractice = "lastPractice",
  lastAdded = "lastAdded",
  mostMistakes = "mostMistakes",
  totalUsers = "totalUsers",
}

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

export type TimelinePoint = {
  dateTime: string;
  cardId: string;
  action: STATISTICS_ACTIONS;
};
