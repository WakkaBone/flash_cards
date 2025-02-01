import {
  MutateOptions,
  useMutation,
  useQueryClient,
} from "@tanstack/react-query";
import { ApiResponse } from "../models/api";
import { markCardLearnedMutation } from "../mutations/mark-learned-mutation";
import { toast } from "react-toastify";

export const useMarkCardLearned = () => {
  const queryClient = useQueryClient();

  const { mutate: mutateMarkLearned, isPending } = useMutation(
    markCardLearnedMutation
  );
  const markCardLearned = (
    cardId: string,
    options?: MutateOptions<ApiResponse, unknown, { cardId: string }, unknown>
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
          toast("Something went wrong", { type: "error" });
          options?.onError?.(...args);
        },
      }
    );

  return { markCardLearned, isPending };
};
