import { useQuery } from "@tanstack/react-query";
import { ApiResponse, GetCardDynamicsFilters } from "../../models/api";
import { GetCardsDynamicsDto } from "../../models/statistics";
import { getCardsDynamicsQuery } from "../../queries/cards";

export const useCardsDynamics = (filters: GetCardDynamicsFilters) => {
  const getCardsDynamics = useQuery<ApiResponse<GetCardsDynamicsDto>>(
    getCardsDynamicsQuery(filters)
  );
  return getCardsDynamics;
};
