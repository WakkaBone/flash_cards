import { UseMutationOptions } from "@tanstack/react-query";
import { CardsService } from "../../services";
import { ApiResponse, UpdateCardPayload } from "../../models/api";

export const updateCardMutation: UseMutationOptions<
  ApiResponse,
  Error,
  UpdateCardPayload
> = {
  mutationFn: async (card) => await CardsService.updateCard(card),
};
