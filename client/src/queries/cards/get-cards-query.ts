import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { CardsService } from "../../services";
import { CardModel } from "../../models/card";
import { QUERY_KEYS } from "../../constants";
import { GetCardsFilters } from "../../models/filters";

export const getCardsQuery = (
  filters: GetCardsFilters
): DefinedInitialDataOptions<ApiResponse<CardModel[]>> => ({
  initialData: { isSuccess: false, data: [] },
  queryKey: [QUERY_KEYS.cards, filters],
  queryFn: async () => await CardsService.getCards(filters),
});
