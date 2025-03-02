import { Box, Button, Input, Stack, TextField } from "@mui/material";
import { GetUsersFilters } from "../../models/api";
import { useEffect } from "react";
import deepEqual from "deep-equal";
import { useScreenSize, useUsersTableFilters } from "../../hooks";
import { DateTimeRangePicker } from "../date-time-range-picker/date-time-range-picker";
import { FilterAlt } from "@mui/icons-material";
import { CollapsibleSection } from "../collapsible/collapsible-section";
import { RoleSelect } from "../role-select/role-select";

export enum FilterTypes {
  Search = "search",
  DateRange = "dateRange",
  Role = "role",
  NumberOfCards = "numberOfCards",
  LongestSteak = "longestStreak",
  CurrentStreak = "currentStreak",
}

type UsersTableFiltersPropsType = {
  filters: GetUsersFilters;
  onChange: (filters: GetUsersFilters) => void;
  enabledFilters?: FilterTypes[];
};

export const UsersFilters = ({
  onChange,
  filters: initialFilters,
  enabledFilters = [
    FilterTypes.Search,
    FilterTypes.DateRange,
    FilterTypes.Role,
    FilterTypes.NumberOfCards,
    FilterTypes.LongestSteak,
    FilterTypes.CurrentStreak,
  ],
}: UsersTableFiltersPropsType) => {
  const { isMobile } = useScreenSize();

  const {
    filters,
    search,
    numberOfCards,
    currentStreak,
    longestStreak,
    handleSearch,
    handleNumberOfCards,
    handleCurrentStreak,
    handleLongestStreak,
    handleDateRange,
    handleRole,
    handleReset,
  } = useUsersTableFilters(initialFilters);

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
        {enabledFilters.includes(FilterTypes.Search) && (
          <Input
            fullWidth
            value={search}
            placeholder="Search"
            onChange={handleSearch}
          />
        )}
        {enabledFilters.includes(FilterTypes.Role) && (
          <RoleSelect showAll value={filters.role} onChange={handleRole} />
        )}
        {enabledFilters.includes(FilterTypes.NumberOfCards) && (
          <TextField
            fullWidth
            type="number"
            label="Cards"
            value={numberOfCards}
            onChange={handleNumberOfCards}
            placeholder="Cards"
          />
        )}
        {enabledFilters.includes(FilterTypes.LongestSteak) && (
          <TextField
            fullWidth
            type="number"
            label="Longest Streak"
            value={longestStreak}
            onChange={handleLongestStreak}
            placeholder="Longest Streak"
          />
        )}
        {enabledFilters.includes(FilterTypes.CurrentStreak) && (
          <TextField
            fullWidth
            type="number"
            label="Current Streak"
            value={currentStreak}
            onChange={handleCurrentStreak}
            placeholder="Current Streak"
          />
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
