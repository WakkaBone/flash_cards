import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Input,
  Stack,
  TextField,
} from "@mui/material";
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
    mistakesThreshold,
    handleSearch,
    handleCategory,
    handleIncludeLearned,
    handleDateRange,
    handleMistakesThreshold,
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
        <Stack
          direction="row"
          spacing={1}
          sx={{ width: isMobile ? "100%" : "200%" }}
        >
          <CategorySelect
            fullWidth
            value={filters.category}
            onChange={handleCategory}
          />
          <TextField
            fullWidth
            type="number"
            label="Mistakes"
            value={mistakesThreshold}
            onChange={handleMistakesThreshold}
            placeholder="Mistakes"
          />
        </Stack>

        <FormControlLabel
          control={
            <Checkbox
              checked={filters.includeLearned}
              onChange={handleIncludeLearned}
            />
          }
          label="With learned"
        />
        <Button onClick={handleReset}>Reset filters</Button>
      </Box>
    </CollapsibleSection>
  );
};
