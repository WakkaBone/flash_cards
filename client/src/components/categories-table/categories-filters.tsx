import { Box, Button, Input, Stack, TextField } from "@mui/material";
import { GetCategoriesFilters } from "../../models/api";
import { useEffect } from "react";
import deepEqual from "deep-equal";
import { useScreenSize, useCategoriesTableFilters } from "../../hooks";
import { DateTimeRangePicker } from "../date-time-range-picker/date-time-range-picker";
import { FilterAlt } from "@mui/icons-material";
import { CollapsibleSection } from "../collapsible/collapsible-section";

export enum FilterTypes {
  Search = "search",
  DateRange = "dateRange",
  NumberOfCards = "numberOfCards",
}

type CategoriesTableFiltersPropsType = {
  filters: GetCategoriesFilters;
  onChange: (filters: GetCategoriesFilters) => void;
  enabledFilters?: FilterTypes[];
};

export const CategoriesFilters = ({
  onChange,
  filters: initialFilters,
  enabledFilters = [
    FilterTypes.Search,
    FilterTypes.DateRange,
    FilterTypes.NumberOfCards,
  ],
}: CategoriesTableFiltersPropsType) => {
  const { isMobile } = useScreenSize();

  const {
    filters,
    search,
    numberOfCards,
    handleSearch,
    handleNumberOfCards,
    handleDateRange,
    handleReset,
  } = useCategoriesTableFilters(initialFilters);

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
        {enabledFilters.includes(FilterTypes.NumberOfCards) && (
          <TextField
            fullWidth
            type="number"
            label="Number of Cards"
            value={numberOfCards}
            onChange={handleNumberOfCards}
            placeholder="Number of Cards"
          />
        )}
        <Stack
          direction="row"
          spacing={1}
          sx={{ width: isMobile ? "100%" : "200%" }}
        >
          {enabledFilters.includes(FilterTypes.DateRange) && (
            <DateTimeRangePicker
              handleDateRangeChange={handleDateRange}
              selectedRange={{
                from: filters.from ?? null,
                to: filters.to ?? null,
              }}
            />
          )}
        </Stack>
        <Button onClick={handleReset}>Reset filters</Button>
      </Box>
    </CollapsibleSection>
  );
};
