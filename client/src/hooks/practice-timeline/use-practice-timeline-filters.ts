import { useState } from "react";
import {
  GetPracticeTimelineFilters,
  STATISTICS_ACTIONS,
} from "../../models/api";
import { SelectChangeEvent } from "@mui/material";
import { AllOptionString } from "../../models/shared";

export type StatisticsActionTypeExtended = STATISTICS_ACTIONS | AllOptionString;

export const getInitialPracticeTimelineFilters =
  (): GetPracticeTimelineFilters => {
    const now = new Date();
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(now.getDate() - 7);

    return { from: oneWeekAgo, to: now, action: AllOptionString.All };
  };

export const usePracticeTimelineFilters = (
  initialFilters: GetPracticeTimelineFilters
) => {
  const [filters, setFilters] =
    useState<GetPracticeTimelineFilters>(initialFilters);

  const handleDateRange = (type: "from" | "to", value: Date | null) => {
    setFilters((prevFilters) => ({
      ...prevFilters,
      [type]: value,
    }));
  };

  const handleActionType = (
    e: SelectChangeEvent<StatisticsActionTypeExtended>
  ) =>
    setFilters((prevFilters) => ({
      ...prevFilters,
      action: e.target.value as STATISTICS_ACTIONS,
    }));

  const handleReset = () => setFilters(getInitialPracticeTimelineFilters());

  return {
    filters,
    handleDateRange,
    handleActionType,
    handleReset,
  };
};
