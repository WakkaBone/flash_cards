import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse, GetCardsFilters } from "../../models/api";
import { CardsService } from "../../services/cards-service";
import { CardModel } from "../../models/card";

export const getCardsQuery = (
  filters: GetCardsFilters
): DefinedInitialDataOptions<ApiResponse<CardModel[]>> => ({
  initialData: { isSuccess: false, data: [] },
  queryKey: ["cards", filters],
  queryFn: async () => await CardsService.getCards(filters),
});
