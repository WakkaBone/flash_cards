import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { GetCardsDynamicsDto } from "../../models/statistics";
import { StatisticsService } from "../../services";
import { QUERY_KEYS } from "../../constants";
import { GetCardDynamicsFilters } from "../../models/filters";

export const getCardsDynamicsQuery = (
  filters: GetCardDynamicsFilters
): DefinedInitialDataOptions<ApiResponse<GetCardsDynamicsDto>> => ({
  initialData: { isSuccess: false, data: { createdAt: {}, lastPractice: {} } },
  queryKey: [QUERY_KEYS.cardsDynamics, filters],
  queryFn: async () => await StatisticsService.getCardsDynamics(filters),
  enabled: Object.keys(filters).length > 0,
});
