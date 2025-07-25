import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Input,
  Stack,
  TextField,
  Tooltip,
} from "@mui/material";
import { GetCardsFilters } from "../../models/filters";
import React, { useEffect } from "react";
import deepEqual from "deep-equal";
import { CategoryAutocomplete } from "../category-select/category-autocomplete";
import { useCardsTableFilters, useScreenSize } from "../../hooks";
import { DateTimeRangePicker } from "../date-time-range-picker/date-time-range-picker";
import { FilterAlt } from "@mui/icons-material";
import { CollapsibleSection } from "../collapsible/collapsible-section";
import { PrioritySelect } from "../priority-select/priority-select";
import { useTimerContext } from "../../context/timer-context";

export enum FilterTypes {
  Search = "search",
  Category = "category",
  IncludeLearned = "includeLearned",
  DateRange = "dateRange",
  MistakesThreshold = "mistakesThreshold",
  Priority = "priority",
  NegativeBalance = "negativeBalance",
}

type CardsTableFiltersPropsType = {
  filters: GetCardsFilters;
  onChange: (filters: GetCardsFilters) => void;
  enabledFilters?: FilterTypes[];
};

export const CardsFilters = React.memo(
  ({
    onChange,
    filters: initialFilters,
    enabledFilters = [
      FilterTypes.Search,
      FilterTypes.DateRange,
      FilterTypes.Category,
      FilterTypes.IncludeLearned,
      FilterTypes.MistakesThreshold,
      FilterTypes.Priority,
      FilterTypes.NegativeBalance,
    ],
  }: CardsTableFiltersPropsType) => {
    const { isMobile, isTablet } = useScreenSize();

    const {
      filters,
      search,
      mistakesThreshold,
      handleSearch,
      handleCategory,
      handleIncludeLearned,
      handleNegativeBalance,
      handleDateRange,
      handleMistakesThreshold,
      handlePriority,
      handleReset,
    } = useCardsTableFilters(initialFilters);

    const timerProps = useTimerContext();
    useEffect(() => {
      if (!deepEqual(filters, initialFilters)) {
        onChange(filters);
        timerProps.sessionActive && timerProps.handleStop();
      }
    }, [filters, initialFilters, onChange, timerProps]);

    return (
      <CollapsibleSection
        buttonText="Filters"
        buttonProps={{ startIcon: <FilterAlt /> }}
      >
        <Box
          sx={{
            flexDirection: isMobile || isTablet ? "column" : "row",
            display: "flex",
            gap: 2,
            padding: 2,
          }}
        >
          {enabledFilters.includes(FilterTypes.Search) && (
            <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
              <Input
                fullWidth
                value={search}
                placeholder="Search"
                onChange={handleSearch}
              />
            </Stack>
          )}
          <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
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
          <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
            {enabledFilters.includes(FilterTypes.Category) && (
              <CategoryAutocomplete
                autocompleteProps={{
                  value: filters.category || null,
                  onChange: handleCategory,
                }}
                inputProps={{ label: "Category", placeholder: "Category" }}
              />
            )}
          </Stack>
          <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
            {enabledFilters.includes(FilterTypes.Priority) && (
              <PrioritySelect
                showAll
                value={filters.priority}
                onChange={handlePriority}
              />
            )}
            {enabledFilters.includes(FilterTypes.MistakesThreshold) && (
              <TextField
                fullWidth
                type="number"
                label="Mistakes"
                value={mistakesThreshold}
                onChange={handleMistakesThreshold}
                placeholder="Mistakes"
              />
            )}
          </Stack>
          <Stack direction="row" spacing={1} sx={{ width: "100%" }}>
            {enabledFilters.includes(FilterTypes.NegativeBalance) && (
              <Tooltip title="Show cards that have more wrong answers than correct">
                <FormControlLabel
                  sx={{ width: "100%" }}
                  control={
                    <Checkbox
                      checked={filters.negativeBalance}
                      onChange={handleNegativeBalance}
                    />
                  }
                  label="Negative balance"
                />
              </Tooltip>
            )}
            {enabledFilters.includes(FilterTypes.IncludeLearned) && (
              <Tooltip title="Include cards that have been marked as learned">
                <FormControlLabel
                  sx={{ width: "100%" }}
                  control={
                    <Checkbox
                      checked={filters.includeLearned}
                      onChange={handleIncludeLearned}
                    />
                  }
                  label="With learned"
                />
              </Tooltip>
            )}
          </Stack>
          <Button onClick={handleReset}>Reset filters</Button>
        </Box>
      </CollapsibleSection>
    );
  }
);
