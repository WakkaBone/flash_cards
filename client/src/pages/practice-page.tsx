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
import { PracticeModes } from "../models/practice-modes";
import { PracticeIntervalInput } from "../components/practice-interval-input/practice-interval-input";

export type PracticeFilersType = Omit<GetCardsFilters, "search">;

const defaultFilters = {
  includeLearned: false,
};

const DEFAULT_INTERVAL = 3;

export const PracticePage = () => {
  const { isMobile } = useScreenSize();

  const [practiceMode, setPracticeMode] = useState(PracticeModes.browse);

  const [interval, setInterval] = useState(DEFAULT_INTERVAL);

  const [filters, setFilters] = useState<PracticeFilersType>(defaultFilters);

  const {
    cardData,
    options,
    getAnotherCard,
    isFetching: isFetchingCard,
    isLoading: isLoadingCard,
    updateCardStats,
    updateStatsRest: { isPending: isUpdatingStats },
  } = useRandomCard(filters, practiceMode);

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
        {practiceMode !== PracticeModes.browse && (
          <PracticeIntervalInput
            interval={interval}
            setInterval={setInterval}
          />
        )}
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
        interval={interval}
        timerProps={{
          stopTimer: pause,
          resumeTimer: resume,
          restartTimer: restart,
          timerSessionActive: timerSessionActive,
        }}
        cardProps={{
          cardData,
          options,
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
