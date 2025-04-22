import { useQuery } from "@tanstack/react-query";
import {
  ApiResponse,
  GetCardDynamicsFilters,
  GetUserDynamicsFilters,
} from "../models/api";
import { GetCardsDynamicsDto, GetUsersDynamicsDto } from "../models/statistics";
import { getCardsDynamicsQuery } from "../queries/cards";
import {
  getSharedChartStyles,
  increasedLegendSpacingPlugin,
  sharedDatasetStyles,
} from "../utils/chart-util";
import { ChartData, ChartOptions } from "chart.js";
import { useScreenSize } from "./use-screen-size";
import { getUsersDynamicsQuery } from "../queries/users";
import { formatDateForChart } from "../utils/date-time";
import { useMemo } from "react";

const prepareChartData = (
  data: GetCardsDynamicsDto = { createdAt: {}, lastPractice: {} },
  from?: Date,
  to?: Date
) => {
  const defaultFrom = new Date();
  defaultFrom.setDate(defaultFrom.getDate() - 7);
  const defaultTo = new Date();

  const labels = [];
  const createdAtValues = [];
  const lastPracticeValues = [];
  let currentDate = from || defaultFrom;

  while (currentDate <= (to || defaultTo)) {
    const formattedDate = formatDateForChart(currentDate);
    labels.push(formattedDate);
    createdAtValues.push(data.createdAt[formattedDate] || 0);
    lastPracticeValues.push(data.lastPractice[formattedDate] || 0);
    currentDate.setDate(currentDate.getDate() + 1);
  }

  return { labels, createdAtValues, lastPracticeValues };
};

const getTooltipLabel = (
  number: number,
  dataset: "card" | "user",
  action: string
) =>
  `${number} ${dataset}${
    dataset === "card"
      ? number === 1
        ? " was"
        : "s were"
      : number === 1
      ? " has"
      : "s have"
  } ${action}`;

const getDynamicsChartOptions = (
  dataset: "cards" | "users",
  isMobile: boolean
): ChartOptions<"line"> => {
  const isCardsDataset = dataset === "cards";

  return {
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
          text: isCardsDataset
            ? isMobile
              ? "Cards"
              : "Number of cards"
            : isMobile
            ? "Users"
            : "Number of users",
        },
      },
    },
    plugins: {
      tooltip: {
        padding: 10,
        callbacks: {
          label: function (tooltipItem) {
            const { datasetIndex, raw } = tooltipItem;
            const action = datasetIndex === 0 ? "practiced" : "added";

            return getTooltipLabel(
              raw as number,
              isCardsDataset ? "card" : "user",
              action
            );
          },
        },
      },
    },
  };
};

export const useDynamicsCharts = (filters: {
  cardsDynamicsFilters?: GetCardDynamicsFilters;
  usersDynamicsFilters?: GetUserDynamicsFilters;
}) => {
  const { cardsDynamicsFilters, usersDynamicsFilters } = filters;
  const { isMobile } = useScreenSize();

  const { data: cardsDynamics } = useQuery<ApiResponse<GetCardsDynamicsDto>>(
    getCardsDynamicsQuery(cardsDynamicsFilters || {})
  );

  const { data: usersDynamics } = useQuery<ApiResponse<GetUsersDynamicsDto>>(
    getUsersDynamicsQuery(usersDynamicsFilters || {})
  );

  const {
    labels: cardsDynamicsLabels,
    createdAtValues: cardsDynamicsCreatedAtValues,
    lastPracticeValues: cardsDynamicsLastPracticeValues,
  } = useMemo(
    () =>
      prepareChartData(
        cardsDynamics?.data,
        cardsDynamicsFilters?.from,
        cardsDynamicsFilters?.to
      ),
    [cardsDynamics?.data, cardsDynamicsFilters?.from, cardsDynamicsFilters?.to]
  );

  const {
    labels: usersDynamicsLabels,
    createdAtValues: usersDynamicsCreatedAtValues,
    lastPracticeValues: usersDynamicsLastPracticeValues,
  } = useMemo(
    () =>
      prepareChartData(
        usersDynamics?.data,
        usersDynamicsFilters?.from,
        usersDynamicsFilters?.to
      ),
    [usersDynamics?.data, usersDynamicsFilters?.from, usersDynamicsFilters?.to]
  );

  const cardsDynamicsChartData: ChartData<"line"> = {
    labels: cardsDynamicsLabels,
    datasets: [
      {
        ...sharedDatasetStyles,
        label: "Cards Practiced",
        data: cardsDynamicsLastPracticeValues,
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.2)",
      },
      {
        ...sharedDatasetStyles,
        label: "Cards Added",
        data: cardsDynamicsCreatedAtValues,
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
      },
    ],
  };

  const usersDynamicsChartData: ChartData<"line"> = {
    labels: usersDynamicsLabels,
    datasets: [
      {
        ...sharedDatasetStyles,
        label: "Users Practiced",
        data: usersDynamicsLastPracticeValues,
        borderColor: "green",
        backgroundColor: "rgba(0, 255, 0, 0.2)",
      },
      {
        ...sharedDatasetStyles,
        label: "Users Joined",
        data: usersDynamicsCreatedAtValues,
        borderColor: "red",
        backgroundColor: "rgba(255, 0, 0, 0.2)",
      },
    ],
  };

  const cardsDynamicsChartOptions: ChartOptions<"line"> =
    getDynamicsChartOptions("cards", isMobile);
  const usersDynamicsChartOptions: ChartOptions<"line"> =
    getDynamicsChartOptions("users", isMobile);

  const chartStyles = getSharedChartStyles(isMobile);

  const plugins = [increasedLegendSpacingPlugin];

  return {
    cardsDynamics: {
      chartData: cardsDynamicsChartData,
      chartOptions: cardsDynamicsChartOptions,
      chartStyles,
      plugins,
    },
    usersDynamics: {
      chartData: usersDynamicsChartData,
      chartOptions: usersDynamicsChartOptions,
      chartStyles,
      plugins,
    },
  };
};
