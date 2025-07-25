import { UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse, UpdateUserPayload } from "../../models/api";
import { UsersService } from "../../services";

export const updateUserMutation: UseMutationOptions<
  ApiResponse,
  Error,
  UpdateUserPayload
> = {
  mutationFn: async (user) => await UsersService.updateUser(user),
};
