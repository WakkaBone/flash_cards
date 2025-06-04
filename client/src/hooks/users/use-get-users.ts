import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { getUsersQuery } from "../../queries/users";
import { UserModel } from "../../models/user";
import { GetUsersFilters } from "../../models/filters";

export const useGetUsers = (filters: GetUsersFilters) => {
  const getUsers = useQuery<ApiResponse<UserModel[]>>(getUsersQuery(filters));
  return getUsers;
};
