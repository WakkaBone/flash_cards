import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { StatisticsService } from "../../services";
import { GetUsersDynamicsDto } from "../../models/statistics";
import { QUERY_KEYS } from "../../constants";
import { GetUserDynamicsFilters } from "../../models/filters";

export const getUsersDynamicsQuery = (
  filters: GetUserDynamicsFilters
): DefinedInitialDataOptions<ApiResponse<GetUsersDynamicsDto>> => ({
  initialData: { isSuccess: false, data: { createdAt: {}, lastPractice: {} } },
  queryKey: [QUERY_KEYS.usersDynamics, filters],
  queryFn: async () => await StatisticsService.getUsersDynamics(filters),
  enabled: Object.keys(filters).length > 0,
});
