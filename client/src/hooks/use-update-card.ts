import {
  MutateOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ApiResponse, UpdateCardPayload } from "../models/api";
import { toast } from "react-toastify";
import { updateCardMutation } from "../mutations/cards";

export const useUpdateCard = () => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation(updateCardMutation);

  const updateCard = (
    card: UpdateCardPayload,
    options?: MutateOptions<ApiResponse, unknown, UpdateCardPayload, unknown>
  ) =>
    mutate(card, {
      onSuccess: (...args) => {
        toast("Card updated successfully", { type: "success" });
        queryClient.invalidateQueries({ queryKey: ["cards"] });
        options?.onSuccess?.(...args);
      },
      onError: (...args) => {
        toast("Something went wrong", { type: "error" });
        options?.onError?.(...args);
      },
      onSettled(data, error, variables, context) {
        if (!data?.isSuccess) toast("Something went wrong", { type: "error" });
        options?.onSettled?.(data, error, variables, context);
      },
    });
  return { updateCard, ...rest };
};
