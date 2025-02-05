import { useState } from "react";
import { Stack } from "@mui/material";

import { WordCard } from "../components/card/card";
import { PageTitle } from "../components/layout/page-title";
import { PracticeFilters } from "../components/practice-filters/practice-filters";
import { Timer } from "../components/card/timer";
import { PracticeModeSelect } from "../components/practice-mode-select/practice-mode-select";

import { useTimer, useScreenSize } from "../hooks";

export enum PracticeModes {
  eth,
  hte,
  browse,
}

export type PracticeFilersType = {
  includeLearned: boolean;
  category?: number;
  from?: Date | null;
  to?: Date | null;
};

const defaultFilters = {
  category: 0,
  includeLearned: false,
  from: null,
  to: null,
};

export const PracticePage = () => {
  const { isMobile } = useScreenSize();

  const [practiceMode, setPracticeMode] = useState(PracticeModes.browse);

  const [filters, setFilters] = useState<PracticeFilersType>(defaultFilters);
  const resetFilters = () => setFilters(defaultFilters);

  const timerProps = useTimer();

  return (
    <>
      <PageTitle>Practice</PageTitle>
      <Stack
        spacing={2}
        alignItems="center"
        direction={isMobile ? "column" : "row"}
        mb={2}
      >
        <PracticeModeSelect
          value={practiceMode}
          onChange={(e) => setPracticeMode(e.target.value as PracticeModes)}
        />
        <Timer {...timerProps} />
      </Stack>
      <PracticeFilters
        filters={filters}
        resetFilters={resetFilters}
        setFilters={setFilters}
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
