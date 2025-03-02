import { useQuery } from "@tanstack/react-query";
import { ApiResponse, GetUsersFilters } from "../../models/api";
import { getUsersQuery } from "../../queries/users";
import { UserModel } from "../../models/user";

export const useGetUsers = (filters: GetUsersFilters) => {
  const getUsers = useQuery<ApiResponse<UserModel[]>>(getUsersQuery(filters));
  return getUsers;
};
