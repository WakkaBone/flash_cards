import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { StatisticsService } from "../../services";
import { StatisticsAdmin } from "../../models/statistics";
import { QUERY_KEYS } from "../../constants";

export const getAdminStatisticsQuery = ({
  enabled,
}: {
  enabled: boolean;
}): DefinedInitialDataOptions<ApiResponse<StatisticsAdmin>> => ({
  initialData: {
    isSuccess: false,
    data: {
      lastAdded: "",
      lastPractice: "",
      longestActiveStreak: "",
      longestStreak: "",
      mostMistakes: "",
      totalCards: 0,
      totalLearnedCards: 0,
      totalUsers: 0,
    },
  },
  enabled,
  queryKey: [QUERY_KEYS.statisticsAdmin],
  queryFn: async () => await StatisticsService.getAdminStatistics(),
});
