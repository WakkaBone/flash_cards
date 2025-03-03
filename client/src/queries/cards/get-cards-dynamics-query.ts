import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse, GetCardDynamicsFilters } from "../../models/api";
import { GetCardsDynamicsDto } from "../../models/statistics";
import { CardsService } from "../../services/cards-service";

export const getCardsDynamicsQuery = (
  filters: GetCardDynamicsFilters
): DefinedInitialDataOptions<ApiResponse<GetCardsDynamicsDto>> => ({
  initialData: { isSuccess: false, data: { createdAt: {}, lastPractice: {} } },
  queryKey: ["cards-dynamics", filters],
  queryFn: async () => await CardsService.getCardsDynamics(filters),
});
