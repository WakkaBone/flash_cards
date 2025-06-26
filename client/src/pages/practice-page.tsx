import { Stack } from "@mui/material";

import { WordCard } from "../components/card/card";
import { PageTitle } from "../components/layout/page-title";
import { PracticeModeSelect } from "../components/practice-mode-select/practice-mode-select";
import {
  CardsFilters,
  FilterTypes,
} from "../components/cards-filters/cards-filters";
import { PracticeSettings } from "../components/practice-settings/practice-settings";
import { GetCardsFilters } from "../models/filters";
import { usePracticeContext } from "../context/practice-context";

export type PracticeFilersType = Omit<GetCardsFilters, "search">;

export const PracticePage = () => {
  const {
    filtersState: { filters, setFilters },
  } = usePracticeContext();

  return (
    <>
      <PageTitle>Practice</PageTitle>
      <Stack mb={2}>
        <PracticeModeSelect />
      </Stack>
      <PracticeSettings />
      <CardsFilters
        filters={filters}
        onChange={setFilters}
        enabledFilters={[
          FilterTypes.DateRange,
          FilterTypes.Category,
          FilterTypes.IncludeLearned,
          FilterTypes.MistakesThreshold,
          FilterTypes.Priority,
        ]}
      />
      <WordCard />
    </>
  );
};
