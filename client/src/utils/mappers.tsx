import { CardsTableRowType } from "../components/cards-table/cards-table";
import { CardModel } from "../models/card";
import { StatisticsCounters } from "../models/statistics";
import { PracticeModes } from "../pages/practice-page";
import { ActionsCell as ActionsCellCards } from "../components/cards-table/actions-cell";
import { CategoryModel } from "../models/category";
import { CategoriesTableRowType } from "../components/categories-table/categories-table";
import { ActionsCell as ActionsCellCategories } from "../components/categories-table/actions-cell";
import { AddCardFormType } from "../components/add-card-form/add-card-form";
import { AddCardPayload, GetCardsFilters } from "../models/api";
import { IdLabel } from "../models/shared";

export const practiceModeMapper: Record<PracticeModes, string> = {
  [PracticeModes.eth]: "English to Hebrew",
  [PracticeModes.hte]: "Hebrew to English",
  [PracticeModes.browse]: "Browse",
};

export const statisticsLabelsMapper: Record<StatisticsCounters, string> = {
  [StatisticsCounters.totalCards]: "Total Cards",
  [StatisticsCounters.totalLearnedCards]: "Learned Cards",
  [StatisticsCounters.currentStreak]: "Current Streak",
  [StatisticsCounters.lastPractice]: "Last Practice",
  [StatisticsCounters.longestStreak]: "Longest Streak",
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

export const mapAddCardFormToPayload = (
  formData: AddCardFormType
): AddCardPayload => ({ ...formData, category: formData.category.id });

export const mapCategoryToSelectOption = ({
  id,
  label,
}: CategoryModel): IdLabel => ({ id, label });

export const compileGetCardsFilters = (filters: GetCardsFilters) => ({
  ...filters,
  category: filters.category?.id || "",
});
