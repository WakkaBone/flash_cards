import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { StatisticsService } from "../../services";
import { Statistics } from "../../models/statistics";
import { QUERY_KEYS } from "../../constants";

export const getStatisticsQuery = (): DefinedInitialDataOptions<
  ApiResponse<Statistics>
> => ({
  initialData: {
    isSuccess: false,
    data: {
      totalCards: 0,
      totalLearnedCards: 0,
      lastAdded: "",
      mostMistakes: "",
      currentStreak: 0,
      longestStreak: 0,
      lastPractice: "",
    },
  },
  queryKey: [QUERY_KEYS.statistics],
  queryFn: async () => await StatisticsService.getStatistics(),
});
