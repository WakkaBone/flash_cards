import { CardModel, Categories } from "./card";

export interface ApiResponse<T = any> {
  isSuccess: boolean;
  data?: T;
  error?: any;
}

export type GetCardsFilters = {
  category?: Categories;
  search?: string;
  includeLearned?: boolean;
};

export enum STATISTICS_ACTIONS {
  Correct = "correct",
  Wrong = "wrong",
}

export type AddCardPayload = {
  category: Categories;
  english: string;
  hebrew: string;
};

export type UpdateCardPayload = CardModel;

export type LoginPayload = {
  username: string;
  password: string;
};
