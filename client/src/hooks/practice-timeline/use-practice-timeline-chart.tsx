import { useQuery } from "@tanstack/react-query";
import {
  ApiResponse,
  GetPracticeTimelineFilters,
  STATISTICS_ACTIONS,
} from "../../models/api";
import { TimelinePoint } from "../../models/statistics";
import { getPracticeTimelineQuery } from "../../queries/cards";
import { statisticsActionMapper } from "../../utils/mappers";
import { ChartData, ChartOptions } from "chart.js";
import { useScreenSize } from "../use-screen-size";
import {
  getSharedChartStyles,
  increasedLegendSpacingPlugin,
  sharedDatasetStyles,
} from "../../utils/chart-util";
import { formatDateForChart } from "../../utils/date-time";

const defaultFrom = new Date();
defaultFrom.setDate(defaultFrom.getDate() - 7);
const defaultTo = new Date();

type StorageObjectType = Record<string, { correct: number; wrong: number }>;

const groupDataByDate = (
  points: TimelinePoint[] = [],
  from: Date,
  to: Date
) => {
  const actionCount: StorageObjectType = {};

  points.forEach((item) => {
    const actionDate = new Date(item.dateTime);
    const formattedDate = formatDateForChart(new Date(item.dateTime));

    if (actionDate >= from && actionDate <= to) {
      if (!actionCount[formattedDate]) {
        actionCount[formattedDate] = { correct: 0, wrong: 0 };
      }
      if (item.action === STATISTICS_ACTIONS.Correct) {
        actionCount[formattedDate].correct += 1;
      } else if (item.action === STATISTICS_ACTIONS.Wrong) {
        actionCount[formattedDate].wrong += 1;
      }
    }
  });

  return actionCount;
};

const prepareChartData = (
  actionCount: StorageObjectType,
  from: Date,
  to: Date
) => {
  const labels = [];
  const correctValues = [];
  const wrongValues = [];
  let currentDate = from;

  while (currentDate <= to) {
    const formattedDate = formatDateForChart(currentDate);
    labels.push(formattedDate);
    correctValues.push(actionCount[formattedDate]?.correct || 0);
    wrongValues.push(actionCount[formattedDate]?.wrong || 0);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { labels, correctValues, wrongValues };
};

const getTooltipLabel = (number: number, isCorrect: boolean) =>
  `${number} card${number === 1 ? " was" : "s were"} guessed ${
    isCorrect ? "correctly" : "wrong"
  }`;

export const usePracticeTimelineChart = (
  filters: GetPracticeTimelineFilters
) => {
  const { isMobile } = useScreenSize();

  const { data } = useQuery<ApiResponse<TimelinePoint[]>>(
    getPracticeTimelineQuery(filters)
  );

  const points = data.data;

  const from = new Date(filters.from || defaultFrom);
  const to = new Date(filters.to || defaultTo);

  const groupedData = groupDataByDate(points, from, to);
  const { labels, correctValues, wrongValues } = prepareChartData(
    groupedData,
    from,
    to
  );

  const chartData: ChartData<"line"> = {
    labels,
    datasets: [
      {
        ...sharedDatasetStyles,
        label: statisticsActionMapper.correct,
        data: correctValues,
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.2)",
      },
      {
        ...sharedDatasetStyles,
        label: statisticsActionMapper.wrong,
        data: wrongValues,
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
      },
    ],
  };

  const chartOptions: ChartOptions<"line"> = {
    responsive: true,
    aspectRatio: isMobile ? 1 : undefined,
    scales: {
      x: {
        ticks: {
          font: {
            size: isMobile ? 10 : 15,
          },
        },
      },
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (value) => (Number.isInteger(value) ? value : ""),
        },
        title: {
          display: true,
          text: isMobile ? "Cards" : "Number of cards",
        },
      },
    },
    plugins: {
      tooltip: {
        padding: 10,
        callbacks: {
          label: function (tooltipItem) {
            const { datasetIndex, raw } = tooltipItem;
            return getTooltipLabel(raw as number, datasetIndex === 0);
          },
        },
      },
    },
  };

  const chartStyles = getSharedChartStyles(isMobile);

  const plugins = [increasedLegendSpacingPlugin];

  return { chartData, chartOptions, chartStyles, plugins };
};
