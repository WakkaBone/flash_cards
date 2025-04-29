import { Box, Button, Stack } from "@mui/material";
import { useEffect } from "react";
import deepEqual from "deep-equal";
import { useScreenSize, useUsersTableFilters } from "../../hooks";
import { DateTimeRangePicker } from "../date-time-range-picker/date-time-range-picker";
import { FilterAlt } from "@mui/icons-material";
import { CollapsibleSection } from "../collapsible/collapsible-section";
import { GetUserDynamicsFilters } from "../../models/api";
import { RoleSelect } from "../role-select/role-select";

export enum FilterTypes {
  DateRange = "dateRange",
  Role = "role",
}

type GetUserDynamicsFiltersPropsType = {
  filters: GetUserDynamicsFilters;
  onChange: (filters: GetUserDynamicsFilters) => void;
  enabledFilters?: FilterTypes[];
};

export const UsersDynamicsFilters = ({
  onChange,
  filters: initialFilters,
  enabledFilters = [FilterTypes.Role, FilterTypes.DateRange],
}: GetUserDynamicsFiltersPropsType) => {
  const { isMobile } = useScreenSize();

  const { filters, handleRole, handleDateRange, handleReset } =
    useUsersTableFilters(initialFilters);

  useEffect(() => {
    if (!deepEqual(filters, initialFilters)) {
      onChange(filters as GetUserDynamicsFilters);
    }
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
        {enabledFilters.includes(FilterTypes.Role) && (
          <Stack
            direction="row"
            spacing={1}
            sx={{ width: isMobile ? "100%" : "200%" }}
          >
            <RoleSelect value={filters.role} onChange={handleRole} showAll />
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
