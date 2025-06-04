import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { GetRandomCardResponse } from "../../models/api";
import { CardsService } from "../../services";
import { PracticeFilersType } from "../../pages/practice-page";
import { PracticeModes } from "../../models/practice-mode";
import { QUERY_KEYS } from "../../constants";

export const getRandomCardQuery = (
  filters: PracticeFilersType,
  mode: PracticeModes
): DefinedInitialDataOptions<GetRandomCardResponse> => ({
  initialData: { isSuccess: false },
  queryKey: [QUERY_KEYS.randomCard, filters, mode],
  queryFn: async () => await CardsService.getRandomCard(filters, mode),
});
