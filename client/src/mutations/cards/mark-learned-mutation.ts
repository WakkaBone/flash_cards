import { UseMutationOptions } from "@tanstack/react-query";
import { CardsService } from "../../services/cards-service";
import { ApiResponse } from "../../models/api";

type ArgsType = {
  cardId: string;
};
export const markCardLearnedMutation: UseMutationOptions<
  ApiResponse,
  Error,
  ArgsType
> = {
  mutationFn: async ({ cardId }) => await CardsService.markLearned(cardId),
};
