import { UseMutationOptions } from "@tanstack/react-query";
import { CardsService } from "../../services/cards-service";
import { ApiResponse } from "../../models/api";

type ArgsType = {
  ids: string[];
};
export const bulkMarkLearnedMutation: UseMutationOptions<
  ApiResponse,
  Error,
  ArgsType
> = {
  mutationFn: async ({ ids }) => await CardsService.bulkMarkLearned(ids),
};
