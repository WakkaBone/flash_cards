import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { CardModel } from "../../models/card";
import { CardsService } from "../../services/cards-service";
import { PracticeFilersType } from "../../pages/practice-page";

export const getRandomCardQuery = (
  filters: PracticeFilersType
): DefinedInitialDataOptions<ApiResponse<CardModel | null>> => ({
  initialData: { isSuccess: false },
  queryKey: ["random-card"],
  queryFn: async () => await CardsService.getRandomCard(filters),
});
