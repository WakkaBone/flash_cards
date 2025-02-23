import { AxiosError, AxiosPromise } from "axios";
import httpClient from "../http-client";
import {
  AddCardPayload,
  ApiResponse,
  BulkDeleteCardsPayload,
  BulkMarkLearnedPayload,
  GetCardsFilters,
  STATISTICS_ACTIONS,
  UpdateCardPayload,
} from "../models/api";
import { CardModel } from "../models/card";
import { Statistics } from "../models/statistics";
import { buildUrl } from "../utils/url-util";
import { handleError } from "../utils/error-handler";
import { compileGetCardsFilters } from "../utils/mappers";

const apiPostfix = "/cards";

export const CardsService = {
  async getCards(filters: GetCardsFilters) {
    const url = buildUrl(apiPostfix, compileGetCardsFilters(filters));
    const response = await httpClient.get<
      ApiResponse<CardModel[]>,
      AxiosPromise<ApiResponse<CardModel[]>> | AxiosError<ApiResponse>
    >(url);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async getRandomCard(filters: GetCardsFilters) {
    const url = buildUrl(
      `${apiPostfix}/random`,
      compileGetCardsFilters(filters)
    );
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

  async bulkMarkLearned(ids: string[]) {
    const response = await httpClient.patch<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      BulkMarkLearnedPayload
    >(`${apiPostfix}/bulk/learned`, { ids });
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

  async bulkDeleteCards(ids: string[]) {
    const response = await httpClient.delete<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      BulkDeleteCardsPayload
    >(`${apiPostfix}/bulk/delete`, { data: { ids } });
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
