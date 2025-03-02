import { Box, Button, Stack } from "@mui/material";
import { useEffect } from "react";
import deepEqual from "deep-equal";
import { useScreenSize, usePracticeTimelineFilters } from "../../hooks";
import { DateTimeRangePicker } from "../date-time-range-picker/date-time-range-picker";
import { FilterAlt } from "@mui/icons-material";
import { CollapsibleSection } from "../collapsible/collapsible-section";
import { StatisticsActionsSelect } from "../statistic-action-select/statistic-action-select";
import { GetPracticeTimelineFilters } from "../../models/api";

export enum FilterTypes {
  DateRange = "dateRange",
  Action = "action",
}

type CategoriesTableFiltersPropsType = {
  filters: GetPracticeTimelineFilters;
  onChange: (filters: GetPracticeTimelineFilters) => void;
  enabledFilters?: FilterTypes[];
};

export const PracticeTimelineFilters = ({
  onChange,
  filters: initialFilters,
  enabledFilters = [FilterTypes.Action, FilterTypes.DateRange],
}: CategoriesTableFiltersPropsType) => {
  const { isMobile } = useScreenSize();

  const { filters, handleActionType, handleDateRange, handleReset } =
    usePracticeTimelineFilters(initialFilters);

  useEffect(() => {
    if (!deepEqual(filters, initialFilters)) onChange(filters);
  }, [filters, initialFilters, onChange]);

  return (
    <CollapsibleSection
      buttonText="Filters"
      buttonProps={{ startIcon: <FilterAlt /> }}
    >
      <Box
        sx={{
          flexDirection: isMobile ? "column" : "row",
          display: "flex",
          gap: 2,
          padding: 2,
        }}
      >
        {enabledFilters.includes(FilterTypes.Action) && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ width: isMobile ? "100%" : "200%" }}
          >
            <StatisticsActionsSelect
              value={filters.action}
              onChange={handleActionType}
            />
          </Stack>
        )}
        {enabledFilters.includes(FilterTypes.DateRange) && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ width: isMobile ? "100%" : "200%" }}
          >
            <DateTimeRangePicker
              handleDateRangeChange={handleDateRange}
              selectedRange={{
                from: filters.from ?? null,
                to: filters.to ?? null,
              }}
            />
          </Stack>
        )}
        <Button onClick={handleReset}>Reset filters</Button>
      </Box>
    </CollapsibleSection>
  );
};
