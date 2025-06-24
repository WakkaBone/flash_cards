import { AxiosError, AxiosPromise } from "axios";
import httpClient from "../http-client";
import {
  AddCardPayload,
  ApiResponse,
  BulkDeleteCardsPayload,
  BulkMarkLearnedPayload,
  STATISTICS_ACTIONS,
  UpdateCardPayload,
} from "../models/api";
import { CardModel } from "../models/card";
import { buildUrl } from "../utils/url-util";
import { handleError } from "../utils/error-handler";
import { compileGetCardsFilters } from "../utils/mappers";
import { PracticeModes } from "../models/practice-mode";
import { GetCardsFilters } from "../models/filters";
import { APIS } from "../constants";
import { VerbConjugations } from "../models/verb";

export class CardsService {
  private static apiPostfix = APIS.cards;

  static async getCards(filters: GetCardsFilters) {
    const url = buildUrl(this.apiPostfix, compileGetCardsFilters(filters));
    const response = await httpClient.get<
      ApiResponse<CardModel[]>,
      AxiosPromise<ApiResponse<CardModel[]>> | AxiosError<ApiResponse>
    >(url);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async getRandomCard(filters: GetCardsFilters, mode: PracticeModes) {
    const url = buildUrl(`${this.apiPostfix}/random`, {
      ...compileGetCardsFilters(filters),
      mode,
    });
    const response = await httpClient.get<
      ApiResponse<CardModel | null>,
      AxiosPromise<ApiResponse<CardModel | null>> | AxiosError<ApiResponse>
    >(url);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async getVerbConjugations(infinitive: string) {
    const url = `${this.apiPostfix}/verbs/${infinitive}`;
    const response = await httpClient.get<
      ApiResponse<VerbConjugations | null>,
      | AxiosPromise<ApiResponse<VerbConjugations | null>>
      | AxiosError<ApiResponse>
    >(url);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async addCardPrecheck(card: AddCardPayload) {
    const response = await httpClient.post<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      AddCardPayload
    >(`${this.apiPostfix}/check`, card);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async addCard(card: AddCardPayload) {
    const response = await httpClient.post<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      AddCardPayload
    >(this.apiPostfix, card);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async updateCardStats(cardId: string, outcome: STATISTICS_ACTIONS) {
    const response = await httpClient.patch<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>
    >(`${this.apiPostfix}/${cardId}/statistics/${outcome}`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async markLearned(cardId: string, shouldMarkAsLearned: boolean) {
    const response = await httpClient.patch<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>
    >(`${this.apiPostfix}/${cardId}/learned/${shouldMarkAsLearned.toString()}`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async bulkMarkLearned(ids: string[]) {
    const response = await httpClient.patch<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      BulkMarkLearnedPayload
    >(`${this.apiPostfix}/bulk/learned`, { ids });
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async deleteCard(cardId: string) {
    const response = await httpClient.delete<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>
    >(`${this.apiPostfix}/${cardId}`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async bulkDeleteCards(ids: string[]) {
    const response = await httpClient.delete<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      BulkDeleteCardsPayload
    >(`${this.apiPostfix}/bulk/delete`, { data: { ids } });
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async updateCard(card: UpdateCardPayload) {
    const response = await httpClient.put<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      UpdateCardPayload
    >(`${this.apiPostfix}/${card.id}`, card);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async importCsv(formData: FormData) {
    const response = await httpClient.post<ApiResponse>(
      `${this.apiPostfix}/import/csv`,
      formData,
      { headers: { "Content-Type": "multipart/form-data" } }
    );
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }
}
