import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import {
  useDeleteCard,
  useMarkCardLearned,
  useRandomCard,
  useTimer,
  useTTS,
} from "../hooks";
import { PracticeModes, PracticeSettingsType } from "../models/practice-mode";
import { GetCardsFilters } from "../models/filters";
import { CardModel } from "../models/card";
import { ApiResponse, STATISTICS_ACTIONS } from "../models/api";
import { MutateOptionsEnhanced } from "../models/mutate-options-enhanced";
import { SelectChangeEvent } from "@mui/material";
import { toastError } from "../utils/error-handler";
import { MAIN_CATEGORIES, TOAST_CONTAINERS_IDS } from "../constants";
import { TimerPropsType } from "../components/card/timer";
import { compareWithoutNiqqud } from "../utils/string-util";
import { shuffleArray } from "../utils/array-util";
import { useHotkeys } from "react-hotkeys-hook";

interface PracticeContextType {
  filtersState: {
    filters: PracticeFilersType;
    setFilters: React.Dispatch<React.SetStateAction<PracticeFilersType>>;
  };
  settingsState: {
    settings: PracticeSettingsType;
    setSettings: React.Dispatch<React.SetStateAction<PracticeSettingsType>>;
  };
  practiceModeState: {
    practiceMode: PracticeModes;
    handleChangePracticeMode: (e: SelectChangeEvent<unknown>) => void;
    eth: boolean;
  };
  cardState: {
    card?: CardModel | null;
    setCard: React.Dispatch<React.SetStateAction<CardModel | undefined | null>>;
    cardIsVerb: boolean;
  };
  actions: {
    getAnotherCard: () => Promise<void>;
    getNextCard: () => void;
    updateCardStats: (
      outcome: STATISTICS_ACTIONS,
      options?: MutateOptionsEnhanced<
        ApiResponse,
        unknown,
        {
          cardId: string;
          outcome: STATISTICS_ACTIONS;
        }
      >
    ) => void;
    handleMarkAsLearned: () => void;
    handleDeleteCard: () => void;
    handleNextButtonClick: () => void;
    handleToggleTranslation: () => void;
    handleCheckTranslation: () => void;
  };
  loadersState: {
    isMarkingLearned: boolean;
    isDeletingCard: boolean;
    isFetchingCard: boolean;
    isLoadingCard: boolean;
    isUpdatingStats: boolean;
    inTransition: boolean;
    isLoading: boolean;
  };
  translationState: {
    translation: string;
    setTranslation: React.Dispatch<React.SetStateAction<string>>;
    resetTranslation: () => void;
    showTranslation: boolean;
    setShowTranslation: React.Dispatch<React.SetStateAction<boolean>>;
  };
  optionsState: {
    options: string[];
    allOptions: string[];
    handleSelectOption: (option: string) => void;
  };
  timerState: TimerPropsType & {
    pause: () => void;
    resume: () => void;
    restart: () => void;
    timerSessionActive: boolean;
  };
  modalsState: {
    verbFormsModal: {
      onOpen: () => void;
      onClose: () => void;
      open: boolean;
    };
    editModal: {
      open: boolean;
      onOpen: () => void;
      onClose: () => void;
      onSuccess: (updatedData: CardModel) => void;
    };
  };
}

const defaultFilters = {
  includeLearned: false,
};

const DEFAULT_INTERVAL = 3;

const defaultSettings = {
  interval: DEFAULT_INTERVAL,
  voiceEnabled: true,
};

const PracticeContext = createContext<PracticeContextType>({
  filtersState: {
    filters: defaultFilters,
    setFilters: () => {},
  },
  settingsState: {
    settings: defaultSettings,
    setSettings: () => {},
  },
  practiceModeState: {
    practiceMode: PracticeModes.browse,
    handleChangePracticeMode: () => {},
    eth: false,
  },
  cardState: {
    card: null,
    setCard: () => {},
    cardIsVerb: false,
  },
  actions: {
    getAnotherCard: () => Promise.resolve(),
    getNextCard: () => {},
    updateCardStats: () => {},
    handleMarkAsLearned: () => {},
    handleDeleteCard: () => {},
    handleNextButtonClick: () => {},
    handleToggleTranslation: () => {},
    handleCheckTranslation: () => {},
  },
  loadersState: {
    isMarkingLearned: false,
    isDeletingCard: false,
    isFetchingCard: false,
    isLoadingCard: false,
    isUpdatingStats: false,
    inTransition: false,
    isLoading: false,
  },
  translationState: {
    translation: "",
    setTranslation: () => {},
    resetTranslation: () => {},
    showTranslation: false,
    setShowTranslation: () => {},
  },
  optionsState: {
    options: [],
    allOptions: [],
    handleSelectOption: () => {},
  },
  timerState: {
    handleIsEnabled: () => {},
    handleStartTimer: () => {},
    handleStopTimer: () => {},
    timerDuration: "",
    handleTimerDurationChange: () => {},
    isRunning: false,
    pause: () => {},
    resume: () => {},
    restart: () => {},
    timerSessionActive: false,
  },
  modalsState: {
    verbFormsModal: {
      onOpen: () => {},
      onClose: () => {},
      open: false,
    },
    editModal: {
      open: false,
      onOpen: () => {},
      onClose: () => {},
      onSuccess: () => {},
    },
  },
});

export type PracticeFilersType = Omit<GetCardsFilters, "search">;

export const PracticeContextProvider = ({ children }: PropsWithChildren) => {
  const [practiceMode, setPracticeMode] = useState(PracticeModes.browse);

  //eth - english to hebrew
  const eth = [PracticeModes.ethInput, PracticeModes.ethSelect].includes(
    practiceMode
  );

  const [settings, setSettings] =
    useState<PracticeSettingsType>(defaultSettings);

  const [filters, setFilters] = useState<PracticeFilersType>(defaultFilters);

  const appliedFilters: PracticeFilersType = {
    ...filters,
    lastCards: settings.lastCards,
  };

  //card
  const {
    cardData,
    options,
    getAnotherCard,
    isFetching: isFetchingCard,
    isLoading: isLoadingCard,
    updateCardStats,
    updateStatsRest: { isPending: isUpdatingStats },
  } = useRandomCard(appliedFilters, practiceMode);

  const [card, setCard] = useState<CardModel | undefined | null>(cardData);

  useEffect(() => {
    cardData && setCard(cardData);
  }, [cardData]);

  const {
    displayedCountdown,
    handleTimerDurationChange,
    handleStartTimer,
    handleStopTimer,
    isRunning,
    pause: pauseTimer,
    restart: restartTimer,
    resume: resumeTimer,
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

  const [inTransition, setInTransition] = useState<boolean>(false);

  const getNextCard = useCallback(() => {
    if (settings.voiceEnabled && cardData)
      settings.voiceWithTranslation
        ? ttsWithTranslation({
            hebrew: cardData.hebrew,
            english: cardData.english,
          })
        : tts(cardData.hebrew);
    getAnotherCard().then(() => restartTimer());
  }, [
    cardData,
    settings.voiceEnabled,
    settings.voiceWithTranslation,
    tts,
    ttsWithTranslation,
    getAnotherCard,
    restartTimer,
  ]);

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

  //translations and checking logic
  const [translation, setTranslation] = useState<string>("");
  const [showTranslation, setShowTranslation] = useState<boolean>(false);

  const isCorrectAnswer = useCallback(
    (translation: string) => {
      if (!card) return;
      const correctAnswer = eth ? card.hebrew : card.english;

      return compareWithoutNiqqud(
        translation.trim().toLowerCase(),
        correctAnswer.trim().toLowerCase()
      );
    },
    [card, eth]
  );

  const handleCheckTranslation = useCallback(() => {
    if (!card || practiceMode === PracticeModes.browse || !translation) return;
    const isCorrect = isCorrectAnswer(translation);

    pauseTimer();
    updateCardStats(
      isCorrect ? STATISTICS_ACTIONS.Correct : STATISTICS_ACTIONS.Wrong,
      {
        onSuccess: () => {
          if (!isCorrect) return;
          setShowTranslation(true);
          setInTransition(true);
          setTimeout(() => {
            getNextCard();
            setInTransition(false);
          }, settings.interval * 1000);
        },
      }
    );
  }, [
    card,
    practiceMode,
    settings.interval,
    updateCardStats,
    getNextCard,
    isCorrectAnswer,
    pauseTimer,
    translation,
  ]);

  const hasOptions = [
    PracticeModes.ethSelect,
    PracticeModes.hteSelect,
  ].includes(practiceMode);

  const handleSelectOption = useCallback(
    (option: string) => {
      if (!hasOptions) return;
      document.activeElement instanceof HTMLElement &&
        document.activeElement.blur();
      setTranslation(option);
    },
    [hasOptions]
  );

  useEffect(() => setTranslation(""), [showTranslation]);

  const handleToggleTranslation = useCallback(() => {
    setShowTranslation((val) => !val);
    updateCardStats(STATISTICS_ACTIONS.Wrong, { hideToast: true });
  }, [updateCardStats]);

  const resetTranslation = useCallback(() => {
    setShowTranslation(false);
    setTranslation("");
  }, []);

  useEffect(() => {
    //cleanup on card change
    resetTranslation();
  }, [card?.id, resetTranslation]);

  const allOptions = useMemo(() => {
    if (!hasOptions) return [];

    const correctOption =
      card?.[PracticeModes.ethSelect === practiceMode ? "hebrew" : "english"] ||
      "";
    return shuffleArray([...options, correctOption]);
  }, [card, practiceMode, options, hasOptions]);

  //actions
  const { markCardLearned, isPending: isMarkingLearned } = useMarkCardLearned();
  const handleMarkAsLearned = useCallback(
    () => card && markCardLearned(card.id, true),
    [markCardLearned, card]
  );

  const { deleteCard, isPending: isDeletingCard } = useDeleteCard();
  const handleDeleteCard = useCallback(
    () => card && deleteCard(card.id),
    [deleteCard, card]
  );

  const handleNextButtonClick = useCallback(() => {
    if (settings.voiceEnabled && card)
      settings.voiceWithTranslation
        ? ttsWithTranslation({ hebrew: card.hebrew, english: card.english })
        : tts(card.hebrew);
    getAnotherCard().then(() => {
      timerSessionActive && restartTimer();
      resetTranslation();
    });
  }, [
    getAnotherCard,
    restartTimer,
    timerSessionActive,
    settings.voiceEnabled,
    settings.voiceWithTranslation,
    tts,
    ttsWithTranslation,
    card,
    resetTranslation,
  ]);

  const isLoading =
    isUpdatingStats ||
    isLoadingCard ||
    isFetchingCard ||
    inTransition ||
    isMarkingLearned ||
    isDeletingCard;

  //edit card modal
  const [isEdit, setIsEdit] = useState<boolean>(false);
  const onOpenEditModal = () => {
    pauseTimer();
    setIsEdit(true);
  };
  const onCloseEditModal = () => {
    setIsEdit(false);
    timerSessionActive && resumeTimer();
  };
  const onSuccessEditModal = (updatedData: CardModel) => setCard(updatedData);

  //verb forms modal
  const cardIsVerb = card?.category.id === MAIN_CATEGORIES.verb;
  const [verbFormsModalOpen, setVerbFormsModalOpen] = useState<boolean>(false);
  const onOpenVerbFormsModal = () => {
    if (!cardIsVerb) return;
    pauseTimer();
    setVerbFormsModalOpen(true);
  };
  const onCloseVerbFormsModal = () => {
    setVerbFormsModalOpen(false);
    timerSessionActive && resumeTimer();
  };

  //bind hotkeys
  const hotkeysConfig = {
    ...(() =>
      Array.from({ length: 4 }, (_, i) => i + 1).reduce((acc, num) => {
        acc[num.toString()] = () =>
          !isLoading && handleSelectOption(allOptions[num - 1]);
        return acc;
      }, {} as Record<string, () => void>))(),
    e: () => !isLoading && card && onOpenEditModal(),
    d: () => !isLoading && handleDeleteCard(),
    l: () => !isLoading && handleMarkAsLearned(),
    f: () => !isLoading && card && handleToggleTranslation(),
  };
  useHotkeys("right", () => !isLoading && getNextCard(), [getNextCard]);
  useHotkeys("Enter", () => !isLoading && handleCheckTranslation(), {
    enableOnFormTags: true,
  });
  useHotkeys(Object.keys(hotkeysConfig), ({ key }) =>
    hotkeysConfig[key as keyof typeof hotkeysConfig]?.()
  );

  return (
    <PracticeContext.Provider
      value={{
        filtersState: { filters: filters, setFilters },
        settingsState: { settings: settings, setSettings },
        practiceModeState: {
          practiceMode,
          handleChangePracticeMode,
          eth,
        },
        cardState: { card, setCard, cardIsVerb },
        actions: {
          getAnotherCard,
          getNextCard,
          handleDeleteCard,
          handleMarkAsLearned,
          handleNextButtonClick,
          updateCardStats,
          handleToggleTranslation,
          handleCheckTranslation,
        },
        loadersState: {
          isMarkingLearned,
          isDeletingCard,
          isFetchingCard,
          isLoadingCard,
          isUpdatingStats,
          inTransition,
          isLoading,
        },
        modalsState: {
          editModal: {
            open: isEdit,
            onClose: onCloseEditModal,
            onOpen: onOpenEditModal,
            onSuccess: onSuccessEditModal,
          },
          verbFormsModal: {
            onClose: onCloseVerbFormsModal,
            onOpen: onOpenVerbFormsModal,
            open: verbFormsModalOpen,
          },
        },
        translationState: {
          translation,
          setTranslation,
          resetTranslation,
          showTranslation,
          setShowTranslation,
        },
        optionsState: { options, allOptions, handleSelectOption },
        timerState: {
          handleIsEnabled,
          timerSessionActive,
          isRunning,
          handleStartTimer,
          handleStopTimer,
          handleTimerDurationChange,
          timerDuration,
          displayedCountdown,
          pause: pauseTimer,
          resume: resumeTimer,
          restart: restartTimer,
        },
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
};

export const usePracticeContext = () => useContext(PracticeContext);
