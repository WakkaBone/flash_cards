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
};

export class Card {
  public category: Categories;
  public hebrew: string;
  public english: string;
  public statistics: StatisticsType;

  constructor(category: Categories, hebrew: string, english: string) {
    this.category = category;
    this.hebrew = hebrew;
    this.english = english;
    this.statistics = {
      correct: 0,
      wrong: 0,
    };
  }

  incrementWrong() {
    this.statistics.wrong++;
  }
  incrementCorrect() {
    this.statistics.correct++;
  }
  getObject() {
    const card: CardModel = {
      category: this.category,
      english: this.english,
      hebrew: this.hebrew,
      statistics: this.statistics,
    };
    return card;
  }
}
