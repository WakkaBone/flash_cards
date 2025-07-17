import { CardsTableRowType } from "../components/cards-table/cards-table";
import { CardModel, Priorities } from "../models/card";
import {
  StatisticsCounters,
  StatisticsCountersAdmin,
} from "../models/statistics";
import { PracticeModes } from "../models/practice-mode";
import { ActionsCell as ActionsCellCards } from "../components/cards-table/actions-cell";
import { CategoryModel } from "../models/category";
import { CategoriesTableRowType } from "../components/categories-table/categories-table";
import { ActionsCell as ActionsCellCategories } from "../components/categories-table/actions-cell";
import { AddCardFormType } from "../components/add-card-form/add-card-form";
import { AddCardPayload, STATISTICS_ACTIONS } from "../models/api";
import { IdLabel } from "../models/shared";
import { Roles, UserModel } from "../models/user";
import { UsersTableRowType } from "../components/users-table/users-table";
import { ActionsCell as ActionsCellUsers } from "../components/users-table/actions-cell";
import { CSV_HEADERS } from "./export-util";
import { GetCardsFilters } from "../models/filters";

export const practiceModeMapper: Record<PracticeModes, string> = {
  [PracticeModes.ethInput]: "English to Hebrew Text Input",
  [PracticeModes.hteInput]: "Hebrew to English Text Input",
  [PracticeModes.ethSelect]: "English to Hebrew Multi Choice",
  [PracticeModes.hteSelect]: "Hebrew to English Multi Choice",
  [PracticeModes.browse]: "Browse",
  [PracticeModes.verbForms]: "Verb forms",
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

export const adminStatisticsLabelsMapper: Record<
  StatisticsCountersAdmin,
  string
> = {
  [StatisticsCountersAdmin.totalCards]: "Total Cards",
  [StatisticsCountersAdmin.lastAdded]: "Last Added",
  [StatisticsCountersAdmin.lastPractice]: "Last Practice",
  [StatisticsCountersAdmin.longestActiveStreak]: "Longest Active Streak",
  [StatisticsCountersAdmin.longestStreak]: "Longest Streak",
  [StatisticsCountersAdmin.mostMistakes]: "Most Mistakes",
  [StatisticsCountersAdmin.totalLearnedCards]: "Total Learned Cards",
  [StatisticsCountersAdmin.totalUsers]: "Total Users",
};

export const priorityMapper: Record<Priorities, string> = {
  [Priorities.Low]: "Low",
  [Priorities.Medium]: "Medium",
  [Priorities.High]: "High",
};

export const statisticsActionMapper: Record<STATISTICS_ACTIONS, string> = {
  [STATISTICS_ACTIONS.Correct]: "Correct",
  [STATISTICS_ACTIONS.Wrong]: "Wrong",
};

export const userRoleMapper: Record<Roles, string> = {
  [Roles.admin]: "Admin",
  [Roles.user]: "User",
};

export const mapCardToTableRow = (item: CardModel): CardsTableRowType => ({
  ...item,
  category: item.category.label,
  correct: item.statistics.correct,
  wrong: item.statistics.wrong,
  balance: item.statistics.correct - item.statistics.wrong,
  isLearned: item.isLearned ? "Yes" : "No",
  actions: <ActionsCellCards card={item} />,
});

export const mapCategoryToTableRow = (
  item: CategoryModel
): CategoriesTableRowType => ({
  ...item,
  name: item.label,
  actions: <ActionsCellCategories category={item} />,
});

export const mapUserToTableRow = (user: UserModel): UsersTableRowType => ({
  ...user,
  actions: <ActionsCellUsers user={user} />,
});

export const mapCardToCsvEntry = (card: CardModel) => ({
  [CSV_HEADERS[0]]: card.english,
  [CSV_HEADERS[1]]: card.hebrew,
  [CSV_HEADERS[2]]: priorityMapper[card.priority],
  [CSV_HEADERS[3]]: card.category.label,
  [CSV_HEADERS[4]]: card.statistics.correct,
  [CSV_HEADERS[5]]: card.statistics.wrong,
  [CSV_HEADERS[6]]: card.isLearned ? "Yes" : "No",
});

export const mapAddCardFormToPayload = (
  formData: AddCardFormType
): AddCardPayload => ({
  ...formData,
  english: formData.english.trim(),
  hebrew: formData.hebrew.trim(),
  category: formData.category.id,
});

export const mapCategoryToSelectOption = ({
  id,
  label,
}: CategoryModel): IdLabel => ({ id, label });

export const compileGetCardsFilters = (filters: GetCardsFilters) => ({
  ...filters,
  category: filters.category?.id || "",
});
