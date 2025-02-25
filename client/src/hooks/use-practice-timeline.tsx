import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../models/api";
import { TimelinePoint } from "../models/statistics";
import { getPracticeTimelineQuery } from "../queries/cards";
import { GetPracticeTimelineFilters } from "./use-practice-timeline-filters";

export const usePracticeTimeline = (filters: GetPracticeTimelineFilters) => {
  const getPracticeTimeline = useQuery<ApiResponse<TimelinePoint[]>>(
    getPracticeTimelineQuery(filters)
  );
  return getPracticeTimeline;
};
