import { CardsTableRowType } from "../components/cards-table/cards-table";
import { CardModel } from "../models/card";
import { StatisticsCounters } from "../models/statistics";
import { PracticeModes } from "../pages/practice-page";
import { ActionsCell as ActionsCellCards } from "../components/cards-table/actions-cell";
import { CategoryModel } from "../models/category";
import { CategoriesTableRowType } from "../components/categories-table/categories-table";
import { ActionsCell as ActionsCellCategories } from "../components/categories-table/actions-cell";

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

export const mapCardToTableRow = (item: CardModel): CardsTableRowType => ({
  ...item,
  category: item.category.label,
  correct: item.statistics.correct,
  wrong: item.statistics.wrong,
  isLearned: item.isLearned ? "Yes" : "No",
  actions: <ActionsCellCards card={item} />,
});

export const mapCategoryToTableRow = (
  item: CategoryModel
): CategoriesTableRowType => ({
  id: item.id,
  name: item.label,
  createdAt: item.createdAt,
  updatedAt: item.updatedAt,
  numberOfCards: item.numberOfCards.toString(),
  actions: <ActionsCellCategories category={item} />,
});
