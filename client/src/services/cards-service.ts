import httpClient from "../http-client";
import { AddCardPayload, ApiResponse, GetCardsFilters } from "../models/api";
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

  async addCard(card: AddCardPayload) {
    const { data: response } = await httpClient.post<
      ApiResponse,
      ApiResponse,
      AddCardPayload
    >(apiPostfix, card);
    return response;
  },
};
