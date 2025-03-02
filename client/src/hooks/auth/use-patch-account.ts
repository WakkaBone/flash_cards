import { useMutation } from "@tanstack/react-query";
import { patchAccountMutation } from "../../mutations/auth";
import {
  ApiResponse,
  AuthUserModel,
  PatchAccountPayload,
} from "../../models/api";
import { toastError } from "../../utils/error-handler";
import { MutateOptionsEnhanced } from "../../models/mutate-options-enhanced";
import { useAuthContext } from "../../context/auth-context";
import { toast } from "react-toastify";

export const usePatchAccount = () => {
  const { mutate, ...rest } = useMutation(patchAccountMutation);
  const { updateUsername } = useAuthContext();

  const patchAccount = (
    patchData: PatchAccountPayload,
    options?: MutateOptionsEnhanced<
      ApiResponse<AuthUserModel>,
      Error,
      PatchAccountPayload
    >
  ) => {
    mutate(patchData, {
      ...options,
      onSuccess: (...args) => {
        if (args[0].isSuccess && patchData.username)
          updateUsername(patchData.username);
        options?.onSuccess?.(...args);
      },
      onError: (...args) => {
        toastError(args[0]);
        options?.onError?.(...args);
      },
      onSettled: (...args) => {
        const isSuccess = args[0]?.isSuccess;
        if (!isSuccess) toastError(args[0]?.error);
        else toast("Account updated successfully", { type: "success" });
        options?.onSettled?.(...args);
      },
    });
  };

  return {
    patchAccount,
    ...rest,
  };
};
