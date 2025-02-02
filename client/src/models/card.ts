export enum Categories {
  Noun = 1,
  Adjective,
  Verb,
  Other,
}

type StatisticsType = {
  correct: number;
  wrong: number;
};

export type CardModel = {
  id: string;
  hebrew: string;
  english: string;
  category: Categories;
  details?: string;
  statistics: StatisticsType;
  createdAt: string;
  isLearned: boolean;
};
