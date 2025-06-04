import { UseMutationOptions } from "@tanstack/react-query";
import { CardsService } from "../../services";
import { ApiResponse } from "../../models/api";

type ArgsType = {
  cardId: string;
  shouldMarkAsLearned: boolean;
};
export const markCardLearnedMutation: UseMutationOptions<
  ApiResponse,
  Error,
  ArgsType
> = {
  mutationFn: async ({ cardId, shouldMarkAsLearned }) =>
    await CardsService.markLearned(cardId, shouldMarkAsLearned),
};
