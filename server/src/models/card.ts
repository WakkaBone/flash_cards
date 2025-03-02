import { FieldValue, Timestamp } from "firebase/firestore";

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
  hebrew: string;
  english: string;
  category: string;
  details?: string;
  statistics: StatisticsType;
  isLearned: boolean;
  createdAt: Timestamp;
  easinessFactor: number;
  interval: number;
  repetitions: number;
  lastReviewDate?: FieldValue;
  nextReviewDate?: FieldValue;
  priority: Priorities;
  ownerIds: string[];
};

export type CardModelDto = Omit<CardModel, "createdAt" | "category"> & {
  id: string;
  createdAt: string;
  category: {
    id: string;
    label: string;
  };
};
