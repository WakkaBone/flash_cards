import { useQuery } from "@tanstack/react-query";
import {
  adminStatisticsLabelsMapper,
  statisticsLabelsMapper,
} from "../utils/mappers";
import {
  Statistics,
  StatisticsAdmin,
  StatisticsCounters,
  StatisticsCountersAdmin,
} from "../models/statistics";
import { format } from "date-fns";
import { isValidDate } from "../utils/date-time";
import { useAuthContext } from "../context/auth-context";
import {
  getAdminStatisticsQuery,
  getStatisticsQuery,
} from "../queries/statistics";

const mapDataToEntries = (
  data: Statistics | StatisticsAdmin,
  isAdmin: boolean
) =>
  Object.entries(data).map(([key, value]) => [
    key,
    key ===
      (isAdmin
        ? StatisticsCountersAdmin.lastPractice
        : StatisticsCounters.lastPractice) &&
    isValidDate((value as string).split(" - ")[0])
      ? `${format((value as string).split(" - ")[0], "dd/MM/yyyy HH:mm")}${
          isAdmin ? " - " + (value as string).split(" - ")[1] : ""
        }`
      : value?.toString(),
    isAdmin
      ? adminStatisticsLabelsMapper[key as StatisticsCountersAdmin]?.toString()
      : statisticsLabelsMapper[key as StatisticsCounters]?.toString(),
  ]);

export const useStatistics = () => {
  const { data: statisticsResponse, ...statisticsRest } = useQuery(
    getStatisticsQuery()
  );
  const statistics = statisticsResponse?.data;
  const statisticsEntries = statistics && mapDataToEntries(statistics, false);

  const { isAdmin } = useAuthContext();
  const { data: adminStatisticsResponse, ...adminStatisticsRest } = useQuery(
    getAdminStatisticsQuery({ enabled: isAdmin })
  );
  const adminStatistics = adminStatisticsResponse?.data;
  const adminStatisticsEntries =
    adminStatistics && mapDataToEntries(adminStatistics, true);

  return {
    statisticsEntries,
    statisticsRest,
    adminStatisticsEntries,
    adminStatisticsRest,
  };
};
