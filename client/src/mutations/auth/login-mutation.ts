import { UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse, AuthUserModel, LoginPayload } from "../../models/api";
import { AuthService } from "../../services";

export const loginMutation: UseMutationOptions<
  ApiResponse<AuthUserModel>,
  Error,
  LoginPayload
> = {
  mutationFn: async (credentials) => await AuthService.login(credentials),
};
