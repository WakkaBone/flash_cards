import {
  MutateOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ApiResponse } from "../models/api";
import { toast } from "react-toastify";
import { deleteCardMutation } from "../mutations/delete-card-mutation";

export const useDeleteCard = () => {
  const queryClient = useQueryClient();

  const { mutate: mutateDeleteCard, isPending } =
    useMutation(deleteCardMutation);
  const deleteCard = (
    cardId: string,
    options?: MutateOptions<ApiResponse, unknown, { cardId: string }, unknown>
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
          toast("Something went wrong", { type: "error" });
          options?.onError?.(...args);
        },
      }
    );

  return { deleteCard, isPending };
};
