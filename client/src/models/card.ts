export enum Categories {
  Noun,
  Adjective,
  Verb,
  Other,
}

type StatisticsType = {
  correct: number;
  wrong: number;
};

export type CardModel = {
  hebrew: string;
  english: string;
  category: Categories;
  statistics: StatisticsType;
  isLearned: boolean;
};
