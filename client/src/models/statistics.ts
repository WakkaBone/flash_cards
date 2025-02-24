export enum StatisticsCounters {
  totalCards = "totalCards",
  totalLearnedCards = "totalLearnedCards",
  currentStreak = "currentStreak",
  longestStreak = "longestStreak",
  lastPractice = "lastPractice",
  lastAdded = "lastAdded",
  mostMistakes = "mostMistakes",
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
