import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse, GetCardDynamicsFilters } from "../../models/api";
import { GetCardsDynamicsDto } from "../../models/statistics";
import { CardsService } from "../../services/cards-service";
import { QUERY_KEYS } from "../../constants";

export const getCardsDynamicsQuery = (
  filters: GetCardDynamicsFilters
): DefinedInitialDataOptions<ApiResponse<GetCardsDynamicsDto>> => ({
  initialData: { isSuccess: false, data: { createdAt: {}, lastPractice: {} } },
  queryKey: [QUERY_KEYS.cardsDynamics, filters],
  queryFn: async () => await CardsService.getCardsDynamics(filters),
  enabled: Object.keys(filters).length > 0,
});
