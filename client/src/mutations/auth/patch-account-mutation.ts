import { UseMutationOptions } from "@tanstack/react-query";
import {
  ApiResponse,
  AuthUserModel,
  PatchAccountPayload,
} from "../../models/api";
import { AuthService } from "../../services/auth-service";

export const patchAccountMutation: UseMutationOptions<
  ApiResponse<AuthUserModel>,
  Error,
  PatchAccountPayload
> = {
  mutationFn: async (patchData) => await AuthService.patchAccount(patchData),
};
