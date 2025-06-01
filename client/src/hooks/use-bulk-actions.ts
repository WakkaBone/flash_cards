import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  bulkDeleteCardsMutation,
  bulkMarkLearnedMutation,
} from "../mutations/cards";
import { toast } from "react-toastify";
import { toastError } from "../utils/error-handler";
import { MutateOptionsEnhanced } from "../models/mutate-options-enhanced";
import { ApiResponse } from "../models/api";
import { QUERY_KEYS } from "../constants";

export const useBulkActions = () => {
  const queryClient = useQueryClient();

  const { mutate: bulkDeleteMutate, ...bulkDeleteRest } = useMutation(
    bulkDeleteCardsMutation
  );

  const { mutate: bulkMarkLearnedMutate, ...bulkMarkLearnedRest } = useMutation(
    bulkMarkLearnedMutation
  );

  const bulkDelete = (
    ids: string[],
    options?: MutateOptionsEnhanced<ApiResponse, unknown, { ids: string[] }>
  ) =>
    bulkDeleteMutate(
      { ids },
      {
        onSuccess: (...args) => {
          toast("Cards deleted", { type: "success" });
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.cards] });
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

  const bulkMarkLearned = (
    ids: string[],
    options?: MutateOptionsEnhanced<ApiResponse, unknown, { ids: string[] }>
  ) =>
    bulkMarkLearnedMutate(
      { ids },
      {
        onSuccess: (...args) => {
          toast("Cards marked as learned", { type: "success" });
          queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.cards] });
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

  const isLoading = bulkDeleteRest.isPending || bulkMarkLearnedRest.isPending;

  return {
    bulkDelete,
    bulkDeleteRest,
    bulkMarkLearned,
    bulkMarkLearnedRest,
    isLoading,
  };
};
