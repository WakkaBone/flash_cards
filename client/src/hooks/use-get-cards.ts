import { useQuery } from "@tanstack/react-query";
import { getCardsQuery } from "../queries/get-cards-query";
import { ApiResponse, GetCardsFilters } from "../models/api";
import { CardModel } from "../models/card";

export const useGetCards = (filters: GetCardsFilters) => {
  const getCards = useQuery<ApiResponse<CardModel[]>>(getCardsQuery(filters));
  return getCards;
};
