import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { CardsService } from "../../services/cards-service";
import { StatisticsAdmin } from "../../models/statistics";

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
  queryKey: ["statistics-admin"],
  queryFn: async () => await CardsService.getAdminStatistics(),
});
