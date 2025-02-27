import { UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { UsersService } from "../../services/users-service";

type ArgsType = {
  userId: string;
};
export const deleteUserMutation: UseMutationOptions<
  ApiResponse,
  Error,
  ArgsType
> = {
  mutationFn: async ({ userId }) => await UsersService.deleteUser(userId),
};
