import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, UpdateUserPayload } from "../../models/api";
import { toast } from "react-toastify";
import { MutateOptionsEnhanced } from "../../models/mutate-options-enhanced";
import { toastError } from "../../utils/error-handler";
import { updateUserMutation } from "../../mutations/users";
import { useAuthContext } from "../../context/auth-context";

export const useUpdateUser = () => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation(updateUserMutation);
  const { isAdmin } = useAuthContext();

  const updateUser = (
    user: UpdateUserPayload,
    options?: MutateOptionsEnhanced<ApiResponse, unknown, UpdateUserPayload>
  ) => {
    if (!isAdmin) {
      toastError({ message: "You do not have the rights to edit users" });
      return;
    }

    mutate(user, {
      onSuccess: (...args) => {
        args[0].isSuccess &&
          toast("User updated successfully", { type: "success" });
        queryClient.invalidateQueries({ queryKey: ["users"] });
        options?.onSuccess?.(...args);
      },
      onError: (...args) => {
        toastError(args[0]);
        options?.onError?.(...args);
      },
      onSettled(data, error, variables, context) {
        if (!data?.isSuccess) toastError(data?.error);
        options?.onSettled?.(data, error, variables, context);
      },
    });
  };

  return { updateUser, ...rest };
};
