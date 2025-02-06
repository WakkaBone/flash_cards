import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "../models/api";
import { markCardLearnedMutation } from "../mutations/cards";
import { toast } from "react-toastify";
import { MutateOptionsEnhanced } from "../models/mutate-options-enhanced";
import { toastError } from "../utils/error-handler";

export const useMarkCardLearned = () => {
  const queryClient = useQueryClient();

  const { mutate: mutateMarkLearned, isPending } = useMutation(
    markCardLearnedMutation
  );
  const markCardLearned = (
    cardId: string,
    options?: MutateOptionsEnhanced<ApiResponse, unknown, { cardId: string }>
  ) =>
    mutateMarkLearned(
      { cardId },
      {
        onSuccess: (...args) => {
          toast("Card marked as learned", { type: "success" });
          queryClient.invalidateQueries({ queryKey: ["cards"] });
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

  return { markCardLearned, isPending };
};
