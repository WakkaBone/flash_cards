export enum StatisticsCounters {
  totalCards = "totalCards",
  totalLearnedCards = "totalLearnedCards",
  totalNouns = "totalNouns",
  totalAdjectives = "totalAdjectives",
  totalVerbs = "totalVerbs",
  totalOther = "totalOther",
  lastAdded = "lastAdded",
  mostMistakes = "mostMistakes",
}

export type Statistics = {
  totalCards: number;
  totalLearnedCards: number;
  totalNouns: number;
  totalAdjectives: number;
  totalVerbs: number;
  totalOther: number;
  lastAdded: string;
  mostMistakes: string;
};
