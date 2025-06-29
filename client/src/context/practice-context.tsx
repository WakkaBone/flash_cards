import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import { useDeleteCard, useMarkCardLearned } from "../hooks";
import { PracticeModes, PracticeSettingsType } from "../models/practice-mode";
import { GetCardsFilters } from "../models/filters";
import { CardModel } from "../models/card";
import { ApiResponse, STATISTICS_ACTIONS } from "../models/api";
import { MutateOptionsEnhanced } from "../models/mutate-options-enhanced";
import { MAIN_CATEGORIES } from "../constants";
import { compareWithoutNiqqud } from "../utils/string-util";
import { shuffleArray } from "../utils/array-util";
import { useHotkeys } from "react-hotkeys-hook";

interface PracticeContextType {
  practiceMode: PracticeModes;
  eth: boolean;
  settings: PracticeSettingsType;
  cardState: {
    card?: CardModel | null;
    setCard: React.Dispatch<React.SetStateAction<CardModel | undefined | null>>;
    cardIsVerb: boolean;
  };
  actions: {
    getNextCard: () => Promise<void>;
    handleMarkAsLearned: () => void;
    handleDeleteCard: () => void;
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

const PracticeContext = createContext<PracticeContextType>({
  practiceMode: PracticeModes.browse,
  eth: false,
  settings: { interval: 3, voiceEnabled: false },
  cardState: {
    card: null,
    setCard: () => {},
    cardIsVerb: false,
  },
  actions: {
    getNextCard: () => Promise.resolve(),
    handleMarkAsLearned: () => {},
    handleDeleteCard: () => {},
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

export const PracticeContextProvider = ({
  children,
  isFetching: isFetchingCard,
  isLoading: isLoadingCard,
  updateCardStats,
  options,
  practiceMode,
  settings,
  updateStatsRest: { isPending: isUpdatingStats },
  cardData,
  timerProps,
  getNextCard,
}: PropsWithChildren<{
  cardData?: CardModel | null;
  options: string[];
  isFetching: boolean;
  isLoading: boolean;
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
  updateStatsRest: { isPending: boolean };
  practiceMode: PracticeModes;
  settings: PracticeSettingsType;
  timerProps: {
    pause: () => void;
    resume: () => void;
    timerSessionActive: boolean;
  };
  getNextCard: () => Promise<void>;
}>) => {
  //eth - english to hebrew
  const eth = [PracticeModes.ethInput, PracticeModes.ethSelect].includes(
    practiceMode
  );
  const [card, setCard] = useState<CardModel | undefined | null>(cardData);

  useEffect(() => {
    cardData && setCard(cardData);
  }, [cardData]);

  const [inTransition, setInTransition] = useState<boolean>(false);

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

    timerProps.pause();
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
    timerProps,
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
    timerProps.pause();
    setIsEdit(true);
  };
  const onCloseEditModal = () => {
    setIsEdit(false);
    setVerbFormsModalOpen(false);
    timerProps.timerSessionActive && timerProps.resume();
  };
  const onSuccessEditModal = (updatedData: CardModel) => setCard(updatedData);

  //verb forms modal
  const cardIsVerb = card?.category.id === MAIN_CATEGORIES.verb;
  const [verbFormsModalOpen, setVerbFormsModalOpen] = useState<boolean>(false);
  const onOpenVerbFormsModal = () => {
    if (!cardIsVerb) return;
    timerProps.pause();
    setVerbFormsModalOpen(true);
  };
  const onCloseVerbFormsModal = () => {
    setVerbFormsModalOpen(false);
    timerProps.timerSessionActive && timerProps.resume();
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
        practiceMode,
        eth,
        settings,
        cardState: { card, setCard, cardIsVerb },
        optionsState: { options, allOptions, handleSelectOption },
        translationState: {
          translation,
          setTranslation,
          resetTranslation,
          showTranslation,
          setShowTranslation,
        },
        actions: {
          getNextCard,
          handleDeleteCard,
          handleMarkAsLearned,
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
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
};

export const usePracticeContext = () => useContext(PracticeContext);
