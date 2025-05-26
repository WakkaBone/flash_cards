import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { GetRandomCardResponse } from "../../models/api";
import { CardsService } from "../../services/cards-service";
import { PracticeFilersType } from "../../pages/practice-page";
import { PracticeModes } from "../../models/practice-modes";

export const getRandomCardQuery = (
  filters: PracticeFilersType,
  mode: PracticeModes
): DefinedInitialDataOptions<GetRandomCardResponse> => ({
  initialData: { isSuccess: false },
  queryKey: ["random-card"],
  queryFn: async () => await CardsService.getRandomCard(filters, mode),
});
