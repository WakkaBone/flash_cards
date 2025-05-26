import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { GetRandomCardResponse } from "../../models/api";
import { CardsService } from "../../services/cards-service";
import { PracticeFilersType, PracticeModes } from "../../pages/practice-page";

export const getRandomCardQuery = (
  filters: PracticeFilersType,
  mode: PracticeModes
): DefinedInitialDataOptions<GetRandomCardResponse> => ({
  initialData: { isSuccess: false },
  queryKey: ["random-card"],
  queryFn: async () => await CardsService.getRandomCard(filters, mode),
});
