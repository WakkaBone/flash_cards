import { DefinedInitialDataOptions } from "@tanstack/react-query";
import {
  ApiResponse,
  GetPracticeTimelineFilters as GetPracticeTimelineFiltersApi,
} from "../../models/api";
import { CardsService } from "../../services/cards-service";
import { TimelinePoint } from "../../models/statistics";
import { GetPracticeTimelineFilters } from "../../hooks/use-practice-timeline-filters";
import { AllActions } from "../../models/shared";

export const getPracticeTimelineQuery = (
  filters: GetPracticeTimelineFilters
): DefinedInitialDataOptions<ApiResponse<TimelinePoint[]>> => ({
  initialData: { isSuccess: false, data: [] },
  queryKey: ["timeline", filters],
  queryFn: async () => {
    const mappedFilters = Object.assign({}, filters);
    if (mappedFilters.action === AllActions.All) delete mappedFilters.action;
    return await CardsService.getPracticeTimeline(
      mappedFilters as GetPracticeTimelineFiltersApi
    );
  },
});
