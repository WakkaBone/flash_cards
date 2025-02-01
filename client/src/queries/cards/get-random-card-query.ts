import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { CardModel, Categories } from "../../models/card";
import { CardsService } from "../../services/cards-service";

export const getRandomCardQuery = ({
  includeLearned,
  category,
}: {
  includeLearned: boolean;
  category?: Categories;
}): DefinedInitialDataOptions<ApiResponse<CardModel>, Error> => ({
  initialData: { isSuccess: false },
  queryKey: ["random-card"],
  queryFn: async () =>
    await CardsService.getRandomCard(includeLearned, category),
});
