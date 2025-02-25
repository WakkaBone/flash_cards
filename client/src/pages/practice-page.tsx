import { useState } from "react";
import { SelectChangeEvent, Stack } from "@mui/material";

import { WordCard } from "../components/card/card";
import { PageTitle } from "../components/layout/page-title";
import { Timer } from "../components/card/timer";
import { PracticeModeSelect } from "../components/practice-mode-select/practice-mode-select";
import { useTimer, useScreenSize, useRandomCard } from "../hooks";
import { GetCardsFilters, STATISTICS_ACTIONS } from "../models/api";
import {
  CardsFilters,
  FilterTypes,
} from "../components/cards-filters/cards-filters";
import { toastError } from "../utils/error-handler";

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

  const {
    cardData,
    getAnotherCard,
    isFetching: isFetchingCard,
    isLoading: isLoadingCard,
    updateCardStats,
    updateStatsRest: { isPending: isUpdatingStats },
  } = useRandomCard(filters);

  const {
    displayedCountdown,
    handleTimerDurationChange,
    handleStartTimer,
    handleStopTimer,
    isRunning,
    pause,
    restart,
    resume,
    timerDuration,
    timerSessionActive,
    handleIsEnabled,
  } = useTimer({
    onExpire: onTimerExpire,
  });

  const handleChangePracticeMode = (e: SelectChangeEvent<unknown>) => {
    setPracticeMode(e.target.value as PracticeModes);
    handleStopTimer();
  };

  const getNextCard = () => getAnotherCard().then(() => restart());

  function onTimerExpire() {
    if (!cardData) return;
    if (practiceMode === PracticeModes.browse) {
      getNextCard();
      return;
    }

    toastError({ message: `Time's up!` }, { autoClose: 100 });
    updateCardStats(STATISTICS_ACTIONS.Wrong, {
      onSuccess: () => getNextCard(),
      onError: () => toastError(),
      hideToast: true,
    });
  }

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
          onChange={handleChangePracticeMode}
        />
        <Timer
          handleTimerDurationChange={handleTimerDurationChange}
          handleStartTimer={handleStartTimer}
          handleStopTimer={handleStopTimer}
          isRunning={isRunning}
          timerDuration={timerDuration}
          timerSessionActive={timerSessionActive}
          displayedCountdown={displayedCountdown}
          handleIsEnabled={handleIsEnabled}
        />
      </Stack>
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
      <WordCard
        mode={practiceMode}
        timerProps={{
          stopTimer: pause,
          resumeTimer: resume,
          restartTimer: restart,
          timerSessionActive: timerSessionActive,
        }}
        cardProps={{
          cardData,
          isLoadingCard,
          isFetchingCard,
          getAnotherCard,
          updateCardStats,
          isUpdatingStats,
        }}
      />
    </>
  );
};
