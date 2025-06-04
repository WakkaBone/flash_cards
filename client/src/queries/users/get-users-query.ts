import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { UsersService } from "../../services";
import { UserModel } from "../../models/user";
import { QUERY_KEYS } from "../../constants";
import { GetUsersFilters } from "../../models/filters";

export const getUsersQuery = (
  filters: GetUsersFilters
): DefinedInitialDataOptions<ApiResponse<UserModel[]>> => ({
  initialData: { isSuccess: false, data: [] },
  queryKey: [QUERY_KEYS.users, filters],
  queryFn: async () => await UsersService.getUsers(filters),
});
