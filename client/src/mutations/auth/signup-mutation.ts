import { UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse, SignupPayload } from "../../models/api";
import { AuthService } from "../../services/auth-service";

export const signupMutation: UseMutationOptions<
  ApiResponse,
  Error,
  SignupPayload
> = {
  mutationFn: async (credentials) => await AuthService.signup(credentials),
};
