import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { StatisticsService } from "../../services";
import { TimelinePoint } from "../../models/statistics";
import { QUERY_KEYS } from "../../constants";
import { GetPracticeTimelineFilters } from "../../models/filters";

export const getPracticeTimelineQuery = (
  filters: GetPracticeTimelineFilters
): DefinedInitialDataOptions<ApiResponse<TimelinePoint[]>> => ({
  initialData: { isSuccess: false, data: [] },
  queryKey: [QUERY_KEYS.timeline, filters],
  queryFn: async () => await StatisticsService.getPracticeTimeline(filters),
});
