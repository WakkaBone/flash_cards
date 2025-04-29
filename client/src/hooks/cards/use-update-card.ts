import { useMutation, useQueryClient } from "@tanstack/react-query";
import { ApiResponse, UpdateCardPayload } from "../../models/api";
import { toast } from "react-toastify";
import { updateCardMutation } from "../../mutations/cards";
import { MutateOptionsEnhanced } from "../../models/mutate-options-enhanced";
import { toastError } from "../../utils/error-handler";
import { TOAST_CONTAINERS_IDS } from "../../constants";

export const useUpdateCard = () => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation(updateCardMutation);

  const updateCard = (
    card: UpdateCardPayload,
    options?: MutateOptionsEnhanced<ApiResponse, unknown, UpdateCardPayload>
  ) =>
    mutate(card, {
      onSuccess: (...args) => {
        const toastContainers = [
          TOAST_CONTAINERS_IDS.card,
          TOAST_CONTAINERS_IDS.cardsTable,
        ];
        toastContainers.forEach((containerId) => {
          toast("Card updated successfully", {
            type: "success",
            containerId,
          });
        });
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
    });
  return { updateCard, ...rest };
};
