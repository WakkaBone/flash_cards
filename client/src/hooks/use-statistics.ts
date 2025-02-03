import { useQuery } from "@tanstack/react-query";
import { getStatisticsQuery } from "../queries/cards/get-statistics-query";
import { statisticsLabelsMapper } from "../utils/mappers";
import { StatisticsCounters } from "../models/statistics";

export const useStatistics = () => {
  const { data, ...rest } = useQuery(getStatisticsQuery());
  const statistics = data?.data;
  const statisticsEntries =
    statistics &&
    Object.entries(statistics).map(([key, value]) => [
      key,
      value.toString(),
      statisticsLabelsMapper[key as StatisticsCounters].toString(),
    ]);

  return { statisticsEntries, ...rest };
};
