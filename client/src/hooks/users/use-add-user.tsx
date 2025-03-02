import { useMutation, useQueryClient } from "@tanstack/react-query";
import { AddUserPayload, ApiResponse } from "../../models/api";
import { MutateOptionsEnhanced } from "../../models/mutate-options-enhanced";
import { toast } from "react-toastify";
import { toastError } from "../../utils/error-handler";
import { addUserMutation } from "../../mutations/users";
import { useAuthContext } from "../../context/auth-context";

export const useAddUser = () => {
  const { isAdmin } = useAuthContext();
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation(addUserMutation);

  const addUser = (
    user: AddUserPayload,
    options?: MutateOptionsEnhanced<ApiResponse, unknown, AddUserPayload>
  ) => {
    if (!isAdmin) {
      toastError({ message: "You do not have the rights to add users" });
      return;
    }

    mutate(user, {
      onSuccess: (...args) => {
        args[0].isSuccess &&
          toast("User added successfully", { type: "success" });
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

  return { addUser, ...rest };
};
