import { usePracticeTimeline } from "../../hooks";
import { GetPracticeTimelineFilters } from "../../hooks/use-practice-timeline-filters";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(
  CategoryScale,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
  Legend
);

type PracticeTimelineChartPropsType = {
  filters: GetPracticeTimelineFilters;
};
export const PracticeTimelineChart = ({
  filters,
}: PracticeTimelineChartPropsType) => {
  const { chartData, chartOptions } = usePracticeTimeline(filters);

  return <Line data={chartData} options={chartOptions} />;
};
