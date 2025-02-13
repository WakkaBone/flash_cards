import { Timestamp } from "firebase/firestore";

type StatisticsType = {
  correct: number;
  wrong: number;
};

export type CardModel = {
  hebrew: string;
  english: string;
  category: string;
  details?: string;
  statistics: StatisticsType;
  isLearned: boolean;
  createdAt: Timestamp;
};

export type CardModelDto = Omit<CardModel, "createdAt"> & {
  id: string;
  createdAt: string;
};
