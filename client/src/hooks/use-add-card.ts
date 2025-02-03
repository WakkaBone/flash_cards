import { useMutation, useQueryClient } from "@tanstack/react-query";
import { addCardMutation } from "../mutations/cards";
import { AddCardPayload, ApiResponse } from "../models/api";
import { toast } from "react-toastify";
import { MutateOptionsEnhanced } from "../models/mutate-options-enhanced";

export const useAddCard = () => {
  const queryClient = useQueryClient();
  const { mutate, ...rest } = useMutation(addCardMutation);

  const addCard = (
    card: AddCardPayload,
    options?: MutateOptionsEnhanced<ApiResponse, unknown, AddCardPayload>
  ) =>
    mutate(card, {
      onSuccess: (...args) => {
        toast("Card added successfully", { type: "success" });
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
  return { addCard, ...rest };
};
