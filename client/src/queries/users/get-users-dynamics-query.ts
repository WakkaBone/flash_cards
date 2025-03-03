import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse, GetUserDynamicsFilters } from "../../models/api";
import { UsersService } from "../../services/users-service";
import { GetUsersDynamicsDto } from "../../models/statistics";

export const getUsersDynamicsQuery = (
  filters: GetUserDynamicsFilters
): DefinedInitialDataOptions<ApiResponse<GetUsersDynamicsDto>> => ({
  initialData: { isSuccess: false, data: { createdAt: {}, lastPractice: {} } },
  queryKey: ["users-dynamics", filters],
  queryFn: async () => await UsersService.getUsersDynamics(filters),
});
