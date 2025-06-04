import { UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { UsersService } from "../../services";

type ArgsType = {
  ids: string[];
};
export const bulkDeleteUsersMutation: UseMutationOptions<
  ApiResponse,
  Error,
  ArgsType
> = {
  mutationFn: async ({ ids }) => await UsersService.bulkDeleteUsers(ids),
};
