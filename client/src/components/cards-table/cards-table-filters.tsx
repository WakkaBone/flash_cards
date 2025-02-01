import { Box, Button, Checkbox, FormControlLabel, Input } from "@mui/material";
import { GetCardsFilters } from "../../models/api";
import { useEffect } from "react";
import deepEqual from "deep-equal";
import { CategorySelect } from "../category-select/category-select";
import { useCardsTableFilters } from "../../hooks/use-cards-table-filters";

type CardsTableFiltersPropsType = {
  filters: GetCardsFilters;
  onChange: (filters: GetCardsFilters) => void;
};

export const CardsTableFilters = ({
  onChange,
  filters: initialFilters,
}: CardsTableFiltersPropsType) => {
  const {
    filters,
    search,
    handleSearch,
    handleCategory,
    handleIncludeLearned,
    handleReset,
  } = useCardsTableFilters(initialFilters);

  useEffect(() => {
    if (!deepEqual(filters, initialFilters)) onChange(filters);
  }, [filters, initialFilters, onChange]);

  return (
    <Box sx={{ flexDirection: "row", display: "flex", gap: 2, padding: 2 }}>
      <Input
        fullWidth
        value={search}
        placeholder="Search"
        onChange={handleSearch}
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
  );
};
