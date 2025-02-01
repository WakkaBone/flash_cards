import { useState } from "react";
import { WordCard } from "../components/card/card";
import { PageTitle } from "../components/layout/page-title";
import { PracticeModeSelect } from "../components/practice-mode-select/practice-mode-select";
import { Button, Checkbox, FormControlLabel, Stack } from "@mui/material";
import { useRandomCard } from "../hooks/use-random-card";
import { CategorySelect } from "../components/category-select/category-select";

export enum PracticeModes {
  eth,
  hte,
  browse,
}

export const PracticePage = () => {
  const [practiceMode, setPracticeMode] = useState(PracticeModes.browse);
  const { filters, setFilters, resetFilters } = useRandomCard();
  return (
    <>
      <PageTitle>Practice</PageTitle>
      <Stack direction={"row"} spacing={2} alignItems={"start"}>
        <PracticeModeSelect
          sx={{ mb: 2 }}
          value={practiceMode}
          onChange={(e) => setPracticeMode(e.target.value as PracticeModes)}
        />
        <CategorySelect
          value={filters.category}
          onChange={(event) =>
            setFilters({ ...filters, category: Number(event.target.value) })
          }
        />
        <FormControlLabel
          control={
            <Checkbox
              checked={filters.includeLearned}
              onChange={(e) =>
                setFilters((v) => ({ ...v, includeLearned: e.target.checked }))
              }
            />
          }
          label="Include learned"
        />
        <Button onClick={resetFilters}>Reset filters</Button>
      </Stack>
      <WordCard mode={practiceMode} />
    </>
  );
};
