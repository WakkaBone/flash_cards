import { IdLabel } from "./shared";

type StatisticsType = {
  correct: number;
  wrong: number;
};

export enum Priorities {
  Low = 1,
  Medium,
  High,
}

export type CardModel = {
  id: string;
  hebrew: string;
  english: string;
  category: IdLabel;
  details?: string;
  statistics: StatisticsType;
  createdAt: string;
  isLearned: boolean;
  priority: Priorities;
};
