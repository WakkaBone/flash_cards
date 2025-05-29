import { AxiosError, AxiosPromise } from "axios";
import httpClient from "../http-client";
import {
  AddCardPayload,
  ApiResponse,
  BulkDeleteCardsPayload,
  BulkMarkLearnedPayload,
  GetCardDynamicsFilters,
  GetCardsFilters,
  STATISTICS_ACTIONS,
  UpdateCardPayload,
} from "../models/api";
import { CardModel } from "../models/card";
import {
  GetCardsDynamicsDto,
  Statistics,
  StatisticsAdmin,
} from "../models/statistics";
import { buildUrl } from "../utils/url-util";
import { handleError } from "../utils/error-handler";
import { compileGetCardsFilters } from "../utils/mappers";
import { PracticeModes } from "../models/practice-mode";

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

  async getRandomCard(filters: GetCardsFilters, mode: PracticeModes) {
    const url = buildUrl(`${apiPostfix}/random`, {
      ...compileGetCardsFilters(filters),
      mode,
    });
    const response = await httpClient.get<
      ApiResponse<CardModel | null>,
      AxiosPromise<ApiResponse<CardModel | null>> | AxiosError<ApiResponse>
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

  async getAdminStatistics() {
    const response = await httpClient.get<
      ApiResponse<Statistics>,
      AxiosPromise<ApiResponse<StatisticsAdmin>> | AxiosError<ApiResponse>
    >(`${apiPostfix}/statistics-admin`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async getCardsDynamics(filters: GetCardDynamicsFilters) {
    const url = buildUrl(`${apiPostfix}/dynamics`, filters);
    const response = await httpClient.get<
      ApiResponse<GetCardsDynamicsDto>,
      AxiosPromise<ApiResponse<GetCardsDynamicsDto>> | AxiosError<ApiResponse>
    >(url);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async importCsv(formData: FormData) {
    const response = await httpClient.post<ApiResponse>(
      `${apiPostfix}/import/csv`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },
};
