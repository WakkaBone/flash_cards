import { UseMutationOptions } from "@tanstack/react-query";
import { CardsService } from "../../services/cards-service";
import { AddCardPayload, ApiResponse } from "../../models/api";

export const addCardMutation: UseMutationOptions<
  ApiResponse,
  Error,
  AddCardPayload
> = {
  mutationFn: async (card) => await CardsService.addCard(card),
};
