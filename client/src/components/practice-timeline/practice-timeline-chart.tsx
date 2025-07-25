import { usePracticeTimelineChart } from "../../hooks";
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
import { GetPracticeTimelineFilters } from "../../models/filters";

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
  const { chartData, chartOptions, chartStyles, plugins } =
    usePracticeTimelineChart(filters);

  return (
    <Line
      data={chartData}
      options={chartOptions}
      style={chartStyles}
      plugins={plugins}
    />
  );
};
