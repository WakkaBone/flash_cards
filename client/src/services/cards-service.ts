import { AxiosError, AxiosPromise } from "axios";
import httpClient from "../http-client";
import {
  AddCardPayload,
  ApiResponse,
  GetCardsFilters,
  STATISTICS_ACTIONS,
  UpdateCardPayload,
} from "../models/api";
import { CardModel } from "../models/card";
import { Statistics } from "../models/statistics";
import { buildUrl } from "../utils/url-util";
import { PracticeFilersType } from "../pages/practice-page";
import { handleError } from "../utils/error-handler";

const apiPostfix = "/cards";

export const CardsService = {
  async getCards(filters: GetCardsFilters) {
    const url = buildUrl(apiPostfix, filters);
    const response = await httpClient.get<
      ApiResponse<CardModel[]>,
      AxiosPromise<ApiResponse<CardModel[]>> | AxiosError<ApiResponse>
    >(url);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async getRandomCard(filters: PracticeFilersType) {
    const { includeLearned, category, from, to } = filters;
    const params: Record<string, boolean | number | Date> = { includeLearned };
    if (category) params["category"] = category;
    if (from) params["from"] = from;
    if (to) params["to"] = to;
    const url = buildUrl(`${apiPostfix}/random`, params);
    const response = await httpClient.get<
      ApiResponse<CardModel>,
      AxiosPromise<ApiResponse<CardModel>> | AxiosError<ApiResponse>
    >(url);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async addCardPrecheck(card: AddCardPayload) {
    const response = await httpClient.post<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      AddCardPayload
    >(`${apiPostfix}/check`, card);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async addCard(card: AddCardPayload) {
    const response = await httpClient.post<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      AddCardPayload
    >(apiPostfix, card);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async updateCardStats(cardId: string, outcome: STATISTICS_ACTIONS) {
    const response = await httpClient.patch<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>
    >(`${apiPostfix}/${cardId}/statistics/${outcome}`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async markLearned(cardId: string) {
    const response = await httpClient.patch<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>
    >(`${apiPostfix}/${cardId}/learned`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async deleteCard(cardId: string) {
    const response = await httpClient.delete<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>
    >(`${apiPostfix}/${cardId}`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async updateCard(card: UpdateCardPayload) {
    const response = await httpClient.put<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      UpdateCardPayload
    >(`${apiPostfix}/${card.id}`, card);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async getStatistics() {
    const response = await httpClient.get<
      ApiResponse<Statistics>,
      AxiosPromise<ApiResponse<Statistics>> | AxiosError<ApiResponse>
    >(`${apiPostfix}/statistics`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },
};
