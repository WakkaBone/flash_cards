import { Categories } from "../models/card";
import { StatisticsCounters } from "../models/statistics";
import { PracticeModes } from "../pages/practice-page";

export const categoryMapper: Record<Categories, string> = {
  [Categories.Noun]: "Noun",
  [Categories.Adjective]: "Adjective",
  [Categories.Verb]: "Verb",
  [Categories.Other]: "Other",
};

export const practiceModeMapper: Record<PracticeModes, string> = {
  [PracticeModes.eth]: "English to Hebrew",
  [PracticeModes.hte]: "Hebrew to English",
  [PracticeModes.browse]: "Browse",
};

export const statisticsLabelsMapper: Record<StatisticsCounters, string> = {
  [StatisticsCounters.totalCards]: "Total Cards",
  [StatisticsCounters.totalLearnedCards]: "Learned Cards",
  [StatisticsCounters.totalNouns]: "Nouns",
  [StatisticsCounters.totalAdjectives]: "Adjectives",
  [StatisticsCounters.totalVerbs]: "Verbs",
  [StatisticsCounters.totalOther]: "Other",
  [StatisticsCounters.lastAdded]: "Last Added",
  [StatisticsCounters.mostMistakes]: "Most Mistakes",
};
