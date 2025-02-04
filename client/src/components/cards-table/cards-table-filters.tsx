import { Box, Button, Checkbox, FormControlLabel, Input } from "@mui/material";
import { GetCardsFilters } from "../../models/api";
import { useEffect } from "react";
import deepEqual from "deep-equal";
import { CategorySelect } from "../category-select/category-select";
import { useCardsTableFilters, useScreenSize } from "../../hooks";
import { DateTimeRangePicker } from "../date-time-range-picker/date-time-range-picker";
import { FilterAlt } from "@mui/icons-material";
import { CollapsibleSection } from "../collapsible/collapsible-section";

type CardsTableFiltersPropsType = {
  filters: GetCardsFilters;
  onChange: (filters: GetCardsFilters) => void;
};

export const CardsTableFilters = ({
  onChange,
  filters: initialFilters,
}: CardsTableFiltersPropsType) => {
  const { isMobile } = useScreenSize();

  const {
    filters,
    search,
    handleSearch,
    handleCategory,
    handleIncludeLearned,
    handleDateRange,
    handleReset,
  } = useCardsTableFilters(initialFilters);

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
        <Input
          fullWidth
          value={search}
          placeholder="Search"
          onChange={handleSearch}
        />
        <DateTimeRangePicker
          handleDateRangeChange={handleDateRange}
          selectedRange={{
            from: filters.from ?? null,
            to: filters.to ?? null,
          }}
        />
        <CategorySelect
          fullWidth
          value={filters.category}
          onChange={handleCategory}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.includeLearned}
              onChange={handleIncludeLearned}
            />
          }
          label="Include learned"
        />
        <Button onClick={handleReset}>Reset filters</Button>
      </Box>
    </CollapsibleSection>
  );
};
