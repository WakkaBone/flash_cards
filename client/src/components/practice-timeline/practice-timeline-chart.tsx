import { usePracticeTimeline } from "../../hooks";
import { GetPracticeTimelineFilters } from "../../hooks/use-practice-timeline-filters";

type PracticeTimelineChartPropsType = {
  filters: GetPracticeTimelineFilters;
};
export const PracticeTimelineChart = ({
  filters,
}: PracticeTimelineChartPropsType) => {
  const { data, isLoading, isFetched } = usePracticeTimeline(filters);

  const points = data.data;

  return (
    <>
      {/* TODO: chart */} {JSON.stringify(points)}
    </>
  );
};
