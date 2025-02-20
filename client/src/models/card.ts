import { IdLabel } from "./shared";

type StatisticsType = {
  correct: number;
  wrong: number;
};

export type CardModel = {
  id: string;
  hebrew: string;
  english: string;
  category: IdLabel;
  details?: string;
  statistics: StatisticsType;
  createdAt: string;
  isLearned: boolean;
};
