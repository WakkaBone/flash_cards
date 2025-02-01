import httpClient from "../http-client";
import {
  AddCardPayload,
  ApiResponse,
  GetCardsFilters,
  STATISTICS_ACTIONS,
} from "../models/api";
import { CardModel } from "../models/card";
import { buildUrl } from "../utils/url-util";

const apiPostfix = "/cards";

export const CardsService = {
  async getCards(filters: GetCardsFilters) {
    const url = buildUrl(apiPostfix, filters);
    const { data: response } = await httpClient.get<ApiResponse<CardModel[]>>(
      url
    );
    return response;
  },

  async getRandomCard(includeLearned: boolean, category?: number) {
    const params: Record<string, boolean | number> = { includeLearned };
    if (category) params["category"] = category;
    const url = buildUrl(`${apiPostfix}/random`, params);
    const { data: response } = await httpClient.get<ApiResponse<CardModel>>(
      url
    );
    return response;
  },

  async addCard(card: AddCardPayload) {
    const { data: response } = await httpClient.post<
      ApiResponse,
      ApiResponse,
      AddCardPayload
    >(apiPostfix, card);
    return response;
  },

  async updateCardStats(cardId: string, outcome: STATISTICS_ACTIONS) {
    const { data: response } = await httpClient.patch<ApiResponse, ApiResponse>(
      `${apiPostfix}/${cardId}/statistics/${outcome}`
    );
    return response;
  },

  async markLearned(cardId: string) {
    const { data: response } = await httpClient.patch<ApiResponse, ApiResponse>(
      `${apiPostfix}/${cardId}/learned`
    );
    return response;
  },

  async deleteCard(cardId: string) {
    const { data: response } = await httpClient.delete<
      ApiResponse,
      ApiResponse
    >(`${apiPostfix}/${cardId}`);
    return response;
  },
};
