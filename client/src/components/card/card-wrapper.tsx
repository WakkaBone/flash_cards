import { useCallback, useEffect } from "react";
import { PracticeContextProvider } from "../../context/practice-context";
import { useRandomCard, useTTS } from "../../hooks";
import { PracticeFilersType } from "../../models/filters";
import {
  PracticeModes,
  PracticeSettingsType,
} from "../../models/practice-mode";
import { WordCard } from "./card";
import { toastError } from "../../utils/error-handler";
import { TOAST_CONTAINERS_IDS } from "../../constants";
import { STATISTICS_ACTIONS } from "../../models/api";
import { useTimerContext } from "../../context/timer-context";

export const CardWrapper = ({
  filters,
  settings,
  practiceMode,
}: {
  filters: PracticeFilersType;
  settings: PracticeSettingsType;
  practiceMode: PracticeModes;
}) => {
  const { tts, ttsWithTranslation } = useTTS();

  const timerProps = useTimerContext();

  const {
    cardData,
    options,
    getAnotherCard,
    isFetching: isFetchingCard,
    isLoading: isLoadingCard,
    updateCardStats,
    updateStatsRest: { isPending: isUpdatingStats },
  } = useRandomCard(filters, practiceMode);

  const getNextCard = useCallback(async () => {
    if (settings.voiceEnabled && cardData)
      settings.voiceWithTranslation
        ? ttsWithTranslation({
            hebrew: cardData.hebrew,
            english: cardData.english,
          })
        : tts(cardData.hebrew);
    getAnotherCard().then(() => {
      if (timerProps.sessionActive) timerProps.restart();
    });
  }, [
    cardData,
    settings.voiceEnabled,
    settings.voiceWithTranslation,
    tts,
    ttsWithTranslation,
    getAnotherCard,
    timerProps,
  ]);

  const onTimerExpire = useCallback(() => {
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
  }, [practiceMode, getNextCard, updateCardStats]);

  useEffect(() => {
    if (timerProps.isExpired) onTimerExpire();
  }, [timerProps.isExpired, onTimerExpire]);

  useEffect(() => {
    if (isLoadingCard || isFetchingCard || isUpdatingStats) timerProps.pause();
  }, [isLoadingCard, isFetchingCard, isUpdatingStats, timerProps]);

  return (
    <PracticeContextProvider
      cardData={cardData}
      options={options}
      isFetching={isFetchingCard}
      isLoading={isLoadingCard}
      updateCardStats={updateCardStats}
      updateStatsRest={{ isPending: isUpdatingStats }}
      practiceMode={practiceMode}
      settings={settings}
      timerProps={{
        pause: timerProps.pause,
        resume: timerProps.resume,
        sessionActive: timerProps.sessionActive,
      }}
      getNextCard={getNextCard}
    >
      <WordCard />
    </PracticeContextProvider>
  );
};
