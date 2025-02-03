import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { CardsService } from "../../services/cards-service";
import { Statistics } from "../../models/statistics";

export const getStatisticsQuery = (): DefinedInitialDataOptions<
  ApiResponse<Statistics | undefined>,
  Error
> => ({
  initialData: {
    isSuccess: false,
    data: {
      totalCards: 0,
      totalLearnedCards: 0,
      lastAdded: "",
      mostMistakes: "",
      totalNouns: 0,
      totalAdjectives: 0,
      totalVerbs: 0,
      totalOther: 0,
    },
  },
  queryKey: ["statistics"],
  queryFn: async () => await CardsService.getStatistics(),
});
