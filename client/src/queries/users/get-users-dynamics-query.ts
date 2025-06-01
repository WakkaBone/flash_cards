import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse, GetUserDynamicsFilters } from "../../models/api";
import { UsersService } from "../../services/users-service";
import { GetUsersDynamicsDto } from "../../models/statistics";
import { QUERY_KEYS } from "../../constants";

export const getUsersDynamicsQuery = (
  filters: GetUserDynamicsFilters
): DefinedInitialDataOptions<ApiResponse<GetUsersDynamicsDto>> => ({
  initialData: { isSuccess: false, data: { createdAt: {}, lastPractice: {} } },
  queryKey: [QUERY_KEYS.usersDynamics, filters],
  queryFn: async () => await UsersService.getUsersDynamics(filters),
  enabled: Object.keys(filters).length > 0,
});
