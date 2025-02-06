import { useState } from "react";
import { Stack } from "@mui/material";

import { WordCard } from "../components/card/card";
import { PageTitle } from "../components/layout/page-title";
import { Timer } from "../components/card/timer";
import { PracticeModeSelect } from "../components/practice-mode-select/practice-mode-select";

import { useTimer, useScreenSize } from "../hooks";
import { GetCardsFilters } from "../models/api";
import {
  CardsFilters,
  FilterTypes,
} from "../components/cards-filters/cards-filters";

export enum PracticeModes {
  eth,
  hte,
  browse,
}

export type PracticeFilersType = Omit<GetCardsFilters, "search">;

const defaultFilters = {
  includeLearned: false,
};

export const PracticePage = () => {
  const { isMobile } = useScreenSize();

  const [practiceMode, setPracticeMode] = useState(PracticeModes.browse);

  const [filters, setFilters] = useState<PracticeFilersType>(defaultFilters);

  const timerProps = useTimer();

  return (
    <>
      <PageTitle>Practice</PageTitle>
      <Stack
        spacing={2}
        alignItems="start"
        direction={isMobile ? "column" : "row"}
        mb={2}
      >
        <PracticeModeSelect
          value={practiceMode}
          onChange={(e) => setPracticeMode(e.target.value as PracticeModes)}
        />
        <Timer {...timerProps} />
      </Stack>
      <CardsFilters
        filters={filters}
        onChange={setFilters}
        enabledFilters={[
          FilterTypes.DateRange,
          FilterTypes.Category,
          FilterTypes.IncludeLearned,
          FilterTypes.MistakesThreshold,
        ]}
      />
      <WordCard
        mode={practiceMode}
        filters={filters}
        timerProps={{
          isEnabled: timerProps.isEnabled,
          timeLeft: timerProps.timeLeft,
          restartTimer: timerProps.restartTimer,
        }}
      />
    </>
  );
};
