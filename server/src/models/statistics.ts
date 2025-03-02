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
