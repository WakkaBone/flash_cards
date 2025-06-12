import { useState } from "react";
import { SelectChangeEvent, Stack } from "@mui/material";

import { WordCard } from "../components/card/card";
import { PageTitle } from "../components/layout/page-title";
import { PracticeModeSelect } from "../components/practice-mode-select/practice-mode-select";
import { useTimer, useRandomCard, useTTS } from "../hooks";
import { STATISTICS_ACTIONS } from "../models/api";
import {
  CardsFilters,
  FilterTypes,
} from "../components/cards-filters/cards-filters";
import { toastError } from "../utils/error-handler";
import { PracticeModes, PracticeSettingsType } from "../models/practice-mode";
import { PracticeSettings } from "../components/practice-settings/practice-settings";
import { TOAST_CONTAINERS_IDS } from "../constants";
import { GetCardsFilters } from "../models/filters";

export type PracticeFilersType = Omit<GetCardsFilters, "search">;

const defaultFilters = {
  includeLearned: false,
};

const DEFAULT_INTERVAL = 3;

export const PracticePage = () => {
  const [practiceMode, setPracticeMode] = useState(PracticeModes.browse);

  const [settings, setSettings] = useState<PracticeSettingsType>({
    interval: DEFAULT_INTERVAL,
    voiceEnabled: true,
  });

  const [filters, setFilters] = useState<PracticeFilersType>(defaultFilters);

  const appliedFilters: PracticeFilersType = {
    ...filters,
    lastCards: settings.lastCards,
  };

  const {
    cardData,
    options,
    getAnotherCard,
    isFetching: isFetchingCard,
    isLoading: isLoadingCard,
    updateCardStats,
    updateStatsRest: { isPending: isUpdatingStats },
  } = useRandomCard(appliedFilters, practiceMode);

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

  const { tts, ttsWithTranslation } = useTTS();

  const handleChangePracticeMode = (e: SelectChangeEvent<unknown>) => {
    setPracticeMode(e.target.value as PracticeModes);
    handleStopTimer();
  };

  const getNextCard = () => {
    if (settings.voiceEnabled && cardData)
      settings.voiceWithTranslation
        ? ttsWithTranslation({
            hebrew: cardData.hebrew,
            english: cardData.english,
          })
        : tts(cardData.hebrew);
    getAnotherCard().then(() => restart());
  };

  function onTimerExpire() {
    if (!cardData) return;
    if (practiceMode === PracticeModes.browse) return getNextCard();

    toastError(
      { message: `Time's up!` },
      { autoClose: 100, containerId: TOAST_CONTAINERS_IDS.card }
    );
    updateCardStats(STATISTICS_ACTIONS.Wrong, {
      onSuccess: () => getNextCard(),
      onError: () =>
        toastError(undefined, { containerId: TOAST_CONTAINERS_IDS.card }),
      hideToast: true,
    });
  }

  return (
    <>
      <PageTitle>Practice</PageTitle>
      <Stack mb={2}>
        <PracticeModeSelect
          value={practiceMode}
          onChange={handleChangePracticeMode}
        />
      </Stack>
      <PracticeSettings
        settings={settings}
        setSettings={setSettings}
        practiceMode={practiceMode}
        timerProps={{
          handleTimerDurationChange,
          handleStartTimer,
          handleStopTimer,
          isRunning,
          timerDuration,
          timerSessionActive,
          displayedCountdown,
          handleIsEnabled,
        }}
      />
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
        settings={settings}
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
