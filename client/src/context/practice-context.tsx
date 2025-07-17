import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
} from "react";
import {
  useCardTranslation,
  useDeleteCard,
  useMarkCardLearned,
  useModal,
} from "../hooks";
import { PracticeModes, PracticeSettingsType } from "../models/practice-mode";
import { GetCardsFilters } from "../models/filters";
import { CardModel } from "../models/card";
import { ApiResponse, STATISTICS_ACTIONS } from "../models/api";
import { MutateOptionsEnhanced } from "../models/mutate-options-enhanced";
import { MAIN_CATEGORIES } from "../constants";
import { shuffleArray } from "../utils/array-util";
import { useHotkeys } from "react-hotkeys-hook";
import { VerbConjugations, VerbTenses } from "../models/verb";
import { BooleanifiedVerbConjugations } from "../hooks/cards/use-card-translation";

interface PracticeContextType {
  practiceMode: PracticeModes;
  eth: boolean;
  inputRef: React.RefObject<HTMLInputElement> | null;
  settings: PracticeSettingsType;
  cardState: {
    card?: CardModel | null;
    cardIsVerb: boolean;
    options: string[];
    verbForms?: VerbConjugations;
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
    setInputtedVerbForms: React.Dispatch<React.SetStateAction<VerbTenses>>;
    verbFormsResult: BooleanifiedVerbConjugations | null;
    showTranslation: boolean;
    handleSelectOption: (option: string) => void;
    verbFormsSubmitted: boolean;
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
  inputRef: null,
  settings: { interval: 3, voiceEnabled: false },
  cardState: {
    card: null,
    cardIsVerb: false,
    options: [],
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
    setInputtedVerbForms: () => {},
    verbFormsResult: null,
    verbFormsSubmitted: false,
    showTranslation: false,
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
  verbForms,
  timerProps,
  getNextCard,
}: PropsWithChildren<{
  cardData?: CardModel | null;
  options: string[];
  verbForms?: VerbConjugations;
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
    sessionActive: boolean;
  };
  getNextCard: () => Promise<void>;
}>) => {
  //eth - english to hebrew
  const eth = [PracticeModes.ethInput, PracticeModes.ethSelect].includes(
    practiceMode
  );

  const hasOptions = [
    PracticeModes.ethSelect,
    PracticeModes.hteSelect,
  ].includes(practiceMode);

  const [card, setCard] = useState<CardModel | undefined | null>(cardData);

  useEffect(() => {
    cardData && setCard(cardData);
  }, [cardData]);

  const cardIsVerb = card?.category.id === MAIN_CATEGORIES.verb;

  const [inTransition, setInTransition] = useState<boolean>(false);

  const {
    translation,
    setTranslation,
    showTranslation,
    setShowTranslation,
    isCorrectTranslation,
    handleSelectOption,
    setInputtedVerbForms,
    verbFormsResult,
    verbFormsSubmitted,
    setVerbFormsSubmitted,
  } = useCardTranslation(card, eth, hasOptions, verbForms);

  const handleCheckTranslation = useCallback(() => {
    if (
      !card ||
      practiceMode === PracticeModes.browse ||
      (practiceMode !== PracticeModes.verbForms && !translation)
    )
      return;

    practiceMode === PracticeModes.verbForms && setVerbFormsSubmitted(true);

    timerProps.pause();
    updateCardStats(
      isCorrectTranslation
        ? STATISTICS_ACTIONS.Correct
        : STATISTICS_ACTIONS.Wrong,
      {
        onSuccess: () => {
          if (!isCorrectTranslation) return;
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
    isCorrectTranslation,
    timerProps,
    translation,
    setShowTranslation,
    setVerbFormsSubmitted,
  ]);

  const handleToggleTranslation = useCallback(() => {
    setShowTranslation((val) => !val);
    updateCardStats(STATISTICS_ACTIONS.Wrong, { hideToast: true });
  }, [updateCardStats, setShowTranslation]);

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

  const verbFormsModal = useModal({
    onOpen: () => timerProps.sessionActive && timerProps.pause(),
    onClose: () => timerProps.sessionActive && timerProps.resume(),
  });

  const editModal: ReturnType<typeof useModal> & {
    onSuccess: (updatedData: CardModel) => void;
  } = {
    ...useModal({
      onOpen: () => timerProps.pause(),
      onClose: () => {
        timerProps.sessionActive && timerProps.resume();
        verbFormsModal.onClose();
      },
    }),
    onSuccess: (updatedData: CardModel) => setCard(updatedData),
  };

  //bind hotkeys
  const hotkeysConfig = {
    ...(() =>
      Array.from({ length: 4 }, (_, i) => i + 1).reduce((acc, num) => {
        acc[num.toString()] = () =>
          !isLoading && handleSelectOption(allOptions[num - 1]);
        return acc;
      }, {} as Record<string, () => void>))(),
    e: () => !isLoading && card && editModal.onOpen(),
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

  //handle focusing on text input when needed
  const inputRef = useRef<HTMLInputElement>(null);
  const shouldFocusOnInput =
    [PracticeModes.ethInput, PracticeModes.hteInput].includes(practiceMode) &&
    !showTranslation;
  useEffect(() => {
    if (shouldFocusOnInput && inputRef.current) inputRef.current.focus();
  }, [shouldFocusOnInput]);

  return (
    <PracticeContext.Provider
      value={{
        practiceMode,
        eth,
        settings,
        inputRef,
        cardState: { card, cardIsVerb, options: allOptions, verbForms },
        translationState: {
          translation,
          setTranslation,
          setInputtedVerbForms,
          verbFormsResult,
          verbFormsSubmitted,
          showTranslation,
          handleSelectOption,
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
        modalsState: { editModal, verbFormsModal },
      }}
    >
      {children}
    </PracticeContext.Provider>
  );
};

export const usePracticeContext = () => useContext(PracticeContext);
