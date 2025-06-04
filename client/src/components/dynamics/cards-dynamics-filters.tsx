import { Box, Button, Stack } from "@mui/material";
import { useEffect } from "react";
import deepEqual from "deep-equal";
import { useCardsTableFilters, useScreenSize } from "../../hooks";
import { DateTimeRangePicker } from "../date-time-range-picker/date-time-range-picker";
import { FilterAlt } from "@mui/icons-material";
import { CollapsibleSection } from "../collapsible/collapsible-section";
import { GetCardDynamicsFilters } from "../../models/filters";
import { PrioritySelect } from "../priority-select/priority-select";

export enum FilterTypes {
  DateRange = "dateRange",
  Priority = "priority",
}

type GetCardsDynamicsFiltersPropsType = {
  filters: GetCardDynamicsFilters;
  onChange: (filters: GetCardDynamicsFilters) => void;
  enabledFilters?: FilterTypes[];
};

export const CardsDynamicsFilters = ({
  onChange,
  filters: initialFilters,
  enabledFilters = [FilterTypes.Priority, FilterTypes.DateRange],
}: GetCardsDynamicsFiltersPropsType) => {
  const { isMobile } = useScreenSize();

  const { filters, handlePriority, handleDateRange, handleReset } =
    useCardsTableFilters(initialFilters);

  useEffect(() => {
    if (!deepEqual(filters, initialFilters))
      onChange(filters as GetCardDynamicsFilters);
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
        {enabledFilters.includes(FilterTypes.Priority) && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ width: isMobile ? "100%" : "200%" }}
          >
            <PrioritySelect
              showAll
              value={filters.priority}
              onChange={handlePriority}
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
