import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { toast } from "react-toastify";
import { deleteCardMutation } from "../../mutations/cards";
import { MutateOptionsEnhanced } from "../../models/mutate-options-enhanced";
import { toastError } from "../../utils/error-handler";

export const useDeleteCard = () => {
  const queryClient = useQueryClient();

  const { mutate: mutateDeleteCard, isPending } =
    useMutation(deleteCardMutation);
  const deleteCard = (
    cardId: string,
    options?: MutateOptionsEnhanced<ApiResponse, unknown, { cardId: string }>
  ) =>
    mutateDeleteCard(
      { cardId },
      {
        onSuccess: (...args) => {
          toast("Card deleted", { type: "success" });
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

  return { deleteCard, isPending };
};
