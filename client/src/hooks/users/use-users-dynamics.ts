import { useQuery } from "@tanstack/react-query";
import { ApiResponse, GetUserDynamicsFilters } from "../../models/api";
import { GetUsersDynamicsDto } from "../../models/statistics";
import { getUsersDynamicsQuery } from "../../queries/users";

export const useUsersDynamics = (filters: GetUserDynamicsFilters) => {
  const getUsersDynamics = useQuery<ApiResponse<GetUsersDynamicsDto>>(
    getUsersDynamicsQuery(filters)
  );
  return getUsersDynamics;
};
