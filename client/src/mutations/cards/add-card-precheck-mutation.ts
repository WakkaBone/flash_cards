import { UseMutationOptions } from "@tanstack/react-query";
import { CardsService } from "../../services";
import { AddCardPayload, ApiResponse } from "../../models/api";

export const addCardPrecheckMutation: UseMutationOptions<
  ApiResponse,
  Error,
  AddCardPayload
> = {
  mutationFn: async (card) => await CardsService.addCardPrecheck(card),
};
