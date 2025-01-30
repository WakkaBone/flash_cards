import { Categories } from "./card";

export interface ApiResponse<T = any> {
  isSuccess: boolean;
  data?: T;
  error?: any;
}

export type GetCardsFilters = { category?: Categories; search?: string };

export type AddCardPayload = {
  category: Categories;
  english: string;
  hebrew: string;
};
