import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse, GetPracticeTimelineFilters } from "../../models/api";
import { UsersService } from "../../services/users-service";
import { TimelinePoint } from "../../models/statistics";
import { QUERY_KEYS } from "../../constants";

export const getPracticeTimelineQuery = (
  filters: GetPracticeTimelineFilters
): DefinedInitialDataOptions<ApiResponse<TimelinePoint[]>> => ({
  initialData: { isSuccess: false, data: [] },
  queryKey: [QUERY_KEYS.timeline, filters],
  queryFn: async () => await UsersService.getPracticeTimeline(filters),
});
