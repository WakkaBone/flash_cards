import { UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse, LoginPayload } from "../../models/api";
import { AuthService } from "../../services/auth-service";

export const loginMutation: UseMutationOptions<
  ApiResponse,
  Error,
  LoginPayload
> = {
  mutationFn: async (credentials) => await AuthService.login(credentials),
};
