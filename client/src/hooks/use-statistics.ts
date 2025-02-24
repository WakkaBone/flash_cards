import { useQuery } from "@tanstack/react-query";
import { getStatisticsQuery } from "../queries/cards/get-statistics-query";
import { statisticsLabelsMapper } from "../utils/mappers";
import { StatisticsCounters } from "../models/statistics";
import { format } from "date-fns";
import { isValidDate } from "../utils/date-time";

export const useStatistics = () => {
  const { data, ...rest } = useQuery(getStatisticsQuery());
  const statistics = data?.data;
  const statisticsEntries =
    statistics &&
    Object.entries(statistics).map(([key, value]) => [
      key,
      key === StatisticsCounters.lastPractice && isValidDate(value as string)
        ? format(value, "dd/MM/yyyy HH:mm")
        : value.toString(),
      statisticsLabelsMapper[key as StatisticsCounters].toString(),
    ]);

  return { statisticsEntries, ...rest };
};
