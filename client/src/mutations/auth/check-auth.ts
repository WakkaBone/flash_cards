import { UseMutationOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { AuthService } from "../../services/auth-service";

export const checkAuthMutation: UseMutationOptions<ApiResponse, Error> = {
  mutationFn: async () => await AuthService.checkAuth(),
};
