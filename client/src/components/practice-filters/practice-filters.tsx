import { Button, Checkbox, FormControlLabel, Stack } from "@mui/material";
import { PracticeFilersType } from "../../pages/practice-page";
import { CategorySelect } from "../category-select/category-select";
import { useScreenSize } from "../../hooks";
import { DateTimeRangePicker } from "../date-time-range-picker/date-time-range-picker";

type PracticeFiltersPropsType = {
  filters: PracticeFilersType;
  setFilters: (filters: PracticeFilersType) => void;
  resetFilters: () => void;
};
export const PracticeFilters = ({
  filters,
  setFilters,
  resetFilters,
}: PracticeFiltersPropsType) => {
  const { isMobile } = useScreenSize();

  return (
    <Stack
      direction={isMobile ? "column" : "row"}
      spacing={2}
      alignItems="center"
      mb={2}
    >
      <Stack direction="row" style={{ width: "100%" }} gap={1}>
        <CategorySelect
          showAll
          value={filters.category}
          onChange={(event) =>
            setFilters({ ...filters, category: Number(event.target.value) })
          }
        />
      </Stack>
      <DateTimeRangePicker
        handleDateRangeChange={(type, val) =>
          setFilters({ ...filters, [type]: val })
        }
        selectedRange={{ from: filters.from ?? null, to: filters.to ?? null }}
      />
      <Stack direction="row" justifyContent={isMobile ? "center" : "unset"}>
        <FormControlLabel
          control={
            <Checkbox
              sx={{ padding: isMobile ? 0 : 1 }}
              checked={filters.includeLearned}
              onChange={(e) =>
                setFilters({ ...filters, includeLearned: e.target.checked })
              }
            />
          }
          label="With learned"
        />
        <Button onClick={resetFilters}>Reset filters</Button>
      </Stack>
    </Stack>
  );
};
