import {
  Box,
  Button,
  Checkbox,
  FormControlLabel,
  Stack,
  TextField,
} from "@mui/material";
import { PracticeModeSelect } from "../practice-mode-select/practice-mode-select";
import { CategorySelect } from "../category-select/category-select";
import { useCardsTableFilters, useScreenSize } from "../../hooks";
import { PracticeFilersType, PracticeModes } from "../../pages/practice-page";
import { DateTimeRangePicker } from "../date-time-range-picker/date-time-range-picker";
import { useEffect } from "react";
import deepEqual from "deep-equal";
import { CollapsibleSection } from "../collapsible/collapsible-section";
import { FilterAlt } from "@mui/icons-material";

type PracticeFiltersPropsType = {
  practiceMode: PracticeModes;
  setPracticeMode: (mode: PracticeModes) => void;
  initialFilters: PracticeFilersType;
  onChange: (filters: PracticeFilersType) => void;
  resetFilters: () => void;
};
export const PracticeFilters = ({
  practiceMode,
  setPracticeMode,
  initialFilters,
  onChange,
}: PracticeFiltersPropsType) => {
  const { isMobile } = useScreenSize();
  const {
    filters,
    mistakesThreshold,
    handleCategory,
    handleDateRange,
    handleIncludeLearned,
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
        <Stack direction="row" style={{ width: "100%" }} gap={1}>
          <PracticeModeSelect
            value={practiceMode}
            onChange={(e) => setPracticeMode(e.target.value as PracticeModes)}
          />
          <CategorySelect
            showAll
            value={filters.category}
            onChange={handleCategory}
          />
        </Stack>
        <DateTimeRangePicker
          handleDateRangeChange={(type, val) => handleDateRange(type, val)}
          selectedRange={{ from: filters.from ?? null, to: filters.to ?? null }}
        />
        <Stack
          direction="row"
          justifyContent={isMobile ? "center" : "unset"}
          sx={{ width: "100%" }}
          gap={1}
        >
          <TextField
            sx={{ width: "50%" }}
            label="Mistakes"
            type="number"
            value={mistakesThreshold}
            onChange={handleMistakesThreshold}
            placeholder="Mistakes"
          />
          <FormControlLabel
            sx={{ width: "50%", ml: 1 }}
            control={
              <Checkbox
                sx={{ padding: 1 }}
                checked={filters.includeLearned}
                onChange={handleIncludeLearned}
              />
            }
            label="With learned"
          />
        </Stack>
        <Button onClick={handleReset}>Reset filters</Button>
      </Box>
    </CollapsibleSection>
  );
};
