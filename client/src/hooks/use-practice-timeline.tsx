import { useQuery } from "@tanstack/react-query";
import { ApiResponse, STATISTICS_ACTIONS } from "../models/api";
import { TimelinePoint } from "../models/statistics";
import { getPracticeTimelineQuery } from "../queries/cards";
import { GetPracticeTimelineFilters } from "./use-practice-timeline-filters";
import { statisticsActionMapper } from "../utils/mappers";
import { ChartData, ChartOptions } from "chart.js";

const formatDate = (date: Date) => date.toISOString().split("T")[0];

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
    const formattedDate = formatDate(new Date(item.dateTime));

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
    const formattedDate = formatDate(currentDate);
    labels.push(formattedDate);
    correctValues.push(actionCount[formattedDate]?.correct || 0);
    wrongValues.push(actionCount[formattedDate]?.wrong || 0);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { labels, correctValues, wrongValues };
};

const sharedDatasetStyles = {
  fill: false,
  tension: 0.1,
  pointRadius: 5,
};

export const usePracticeTimeline = (filters: GetPracticeTimelineFilters) => {
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
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1,
          callback: (value) => (Number.isInteger(value) ? value : ""),
        },
        title: {
          display: true,
          text: "Number of cards",
        },
      },
    },
    plugins: {
      tooltip: {
        padding: 10,
        callbacks: {
          label: function (tooltipItem) {
            const { datasetIndex, raw } = tooltipItem;
            switch (datasetIndex) {
              case 0:
                return `${raw} card${
                  raw === 1 ? " was" : "s were"
                } guessed correctly`;
              case 1:
                return `${raw} card${
                  raw === 1 ? " was" : "s were"
                } guessed wrong on`;
            }
          },
        },
      },
    },
  };

  return { chartData, chartOptions };
};
