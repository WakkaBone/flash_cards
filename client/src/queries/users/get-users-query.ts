import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse, GetUsersFilters } from "../../models/api";
import { UsersService } from "../../services/users-service";
import { UserModel } from "../../models/user";
import { QUERY_KEYS } from "../../constants";

export const getUsersQuery = (
  filters: GetUsersFilters
): DefinedInitialDataOptions<ApiResponse<UserModel[]>> => ({
  initialData: { isSuccess: false, data: [] },
  queryKey: [QUERY_KEYS.users, filters],
  queryFn: async () => await UsersService.getUsers(filters),
});
