import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { toast } from "react-toastify";
import { MutateOptionsEnhanced } from "../../models/mutate-options-enhanced";
import { toastError } from "../../utils/error-handler";
import {
  bulkDeleteUsersMutation,
  deleteUserMutation,
} from "../../mutations/users";
import { useAuthContext } from "../../context/auth-context";
import { QUERY_KEYS } from "../../constants";

export const useDeleteUsers = () => {
  const queryClient = useQueryClient();

  const { mutate: mutateDeleteUser, ...deleteUserRest } =
    useMutation(deleteUserMutation);

  const { user, isAdmin } = useAuthContext();

  const deleteUser = (
    userId: string,
    options?: MutateOptionsEnhanced<ApiResponse, unknown, { userId: string }>
  ) => {
    if (!isAdmin) {
      toastError({ message: "You do not have the rights to delete users" });
      return;
    }

    const canDelete = userId !== (user?.id as string);
    if (!canDelete) {
      toastError({ message: "You cannot remove yourself" });
      return;
    }

    mutateDeleteUser(
      { userId },
      {
        onSuccess: (...args) => {
          toast("User deleted", { type: "success" });
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.users] });
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
      }
    );
  };

  const { mutate: mutateBulkDeleteUsers, ...bulkDeleteUsersRest } = useMutation(
    bulkDeleteUsersMutation
  );

  const bulkDeleteUsers = (
    ids: string[],
    options?: MutateOptionsEnhanced<ApiResponse, unknown, { ids: string[] }>
  ) => {
    if (!isAdmin) {
      toastError({ message: "You do not have the rights to delete users" });
      return;
    }

    const canDelete = !ids.includes(user?.id as string);
    if (!canDelete) {
      toastError({ message: "You cannot remove yourself" });
      return;
    }

    mutateBulkDeleteUsers(
      { ids },
      {
        onSuccess: (...args) => {
          toast("Users deleted", { type: "success" });
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.users] });
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
      }
    );
  };

  return {
    deleteUser,
    deleteUserRest,
    bulkDeleteUsers,
    bulkDeleteUsersRest,
  };
};
