import { UseMutationOptions } from "@tanstack/react-query";
import { AddUserPayload, ApiResponse } from "../../models/api";
import { UsersService } from "../../services/users-service";

export const addUserMutation: UseMutationOptions<
  ApiResponse,
  Error,
  AddUserPayload
> = {
  mutationFn: async (user) => await UsersService.addUser(user),
};
