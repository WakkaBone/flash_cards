import { UseMutationOptions } from "@tanstack/react-query";
import { CardsService } from "../../services";
import { ApiResponse, STATISTICS_ACTIONS } from "../../models/api";

type ArgsType = {
  cardId: string;
  outcome: STATISTICS_ACTIONS;
};
export const updateCardStatsMutation: UseMutationOptions<
  ApiResponse,
  Error,
  ArgsType
> = {
  mutationFn: async ({ cardId, outcome }) =>
    await CardsService.updateCardStats(cardId, outcome),
};
