import {
  Box,
  Button,
  ButtonOwnProps,
  Card,
  CardActions,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import {
  PracticeModes,
  PracticeSettingsType,
} from "../../models/practice-mode";
import { useCallback, useEffect, useMemo, useState } from "react";
import { ApiResponse, STATISTICS_ACTIONS } from "../../models/api";
import { ToastContainer } from "react-toastify";
import {
  useMarkCardLearned,
  useDeleteCard,
  useScreenSize,
  useTTS,
} from "../../hooks";
import { EditCardModal } from "../edit-card-modal/edit-card-modal";
import {
  DeleteForeverRounded,
  EditRounded,
  QuestionMarkRounded,
  SentimentVeryDissatisfiedRounded,
  TaskAltRounded,
  NavigateNextRounded,
} from "@mui/icons-material";
import { CardModel } from "../../models/card";
import { useHotkeys } from "react-hotkeys-hook";
import { CardSkeletonLoader } from "./card-skeleton-loader";
import { CenteredLoader } from "../loader/loader";
import { MutateOptionsEnhanced } from "../../models/mutate-options-enhanced";
import { TOAST_CONTAINERS_IDS } from "../../constants";
import { Options } from "./options";
import { shuffleArray } from "../../utils/array-util";
import { HotkeysLegend } from "./hotkeys-legend";
import { UtterButton } from "./utter-button";
import { IntervalCountdown } from "./interval-countdown";
import { compareWithoutNiqqud } from "../../utils/string-util";

type WordCardPropsType = {
  mode: PracticeModes;
  settings: PracticeSettingsType;
  timerProps: {
    stopTimer: () => void;
    resumeTimer: () => void;
    restartTimer: () => void;
    timerSessionActive: boolean;
  };
  cardProps: {
    cardData?: CardModel | null;
    options: string[];
    isLoadingCard: boolean;
    isFetchingCard: boolean;
    getAnotherCard: () => Promise<void>;
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
    isUpdatingStats: boolean;
  };
};

export const WordCard = ({
  mode,
  settings,
  timerProps,
  cardProps,
}: WordCardPropsType) => {
  const { isMobile } = useScreenSize();
  const { tts, ttsWithTranslation } = useTTS();

  const { stopTimer, resumeTimer, restartTimer, timerSessionActive } =
    timerProps;

  const { interval, voiceEnabled, voiceWithTranslation } = settings;

  //eth - english to hebrew
  const eth = [PracticeModes.ethInput, PracticeModes.ethSelect].includes(mode);

  const hasOptions = [
    PracticeModes.ethSelect,
    PracticeModes.hteSelect,
  ].includes(mode);

  const {
    cardData,
    options,
    isLoadingCard,
    isFetchingCard,
    getAnotherCard,
    updateCardStats,
    isUpdatingStats,
  } = cardProps;

  const { markCardLearned, isPending: isMarkingLearned } = useMarkCardLearned();
  const { deleteCard, isPending: isDeletingCard } = useDeleteCard();

  const [card, setCard] = useState<CardModel | undefined | null>(cardData);

  const [inTransition, setInTransition] = useState<boolean>(false);

  useEffect(() => {
    cardData && setCard(cardData);
  }, [cardData]);

  const [translation, setTranslation] = useState<string>("");
  const [showTranslation, setShowTranslation] = useState<boolean>(false);

  useEffect(() => {
    //cleanup on card change
    setTranslation("");
    setShowTranslation(false);
  }, [cardData?.id]);

  const getNextCard = useCallback(() => {
    if (voiceEnabled && card)
      voiceWithTranslation
        ? ttsWithTranslation({ hebrew: card.hebrew, english: card.english })
        : tts(card.hebrew);
    getAnotherCard().then(() => timerSessionActive && restartTimer());
  }, [
    getAnotherCard,
    restartTimer,
    timerSessionActive,
    voiceEnabled,
    voiceWithTranslation,
    tts,
    ttsWithTranslation,
    card,
  ]);

  const isCorrectAnswer = useCallback(() => {
    if (!card) return;
    const correctAnswer = eth ? card.hebrew : card.english;

    return compareWithoutNiqqud(
      translation.trim().toLowerCase(),
      correctAnswer.trim().toLowerCase()
    );
  }, [card, translation, eth]);

  const handleCheckTranslation = useCallback(() => {
    if (!card || mode === PracticeModes.browse || !translation) return;
    const isCorrect = isCorrectAnswer();

    stopTimer();
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
          }, interval * 1000);
        },
      }
    );
  }, [
    card,
    mode,
    interval,
    translation,
    updateCardStats,
    getNextCard,
    isCorrectAnswer,
    stopTimer,
  ]);

  const handleToggleTranslation = useCallback(() => {
    setShowTranslation((val) => !val);
    updateCardStats(STATISTICS_ACTIONS.Wrong, { hideToast: true });
  }, [updateCardStats]);

  const handleSelectOption = useCallback(
    (option: string) => {
      if (!hasOptions) return;
      document.activeElement instanceof HTMLElement &&
        document.activeElement.blur();
      setTranslation(option);
    },
    [hasOptions]
  );

  const allOptions = useMemo(() => {
    if (!hasOptions) return [];

    const correctOption =
      card?.[PracticeModes.ethSelect === mode ? "hebrew" : "english"] || "";
    return shuffleArray([...options, correctOption]);
  }, [card, mode, options, hasOptions]);

  const getCardBodyByMode = useCallback(() => {
    switch (mode) {
      case PracticeModes.ethInput:
      case PracticeModes.hteInput:
        return (
          <TextField
            value={
              showTranslation
                ? card?.[PracticeModes.ethInput === mode ? "hebrew" : "english"]
                : translation
            }
            disabled={showTranslation}
            placeholder="Enter translation"
            onChange={(e) => setTranslation(e.target.value)}
            inputRef={(ref) => ref && ref.focus()}
          />
        );
      case PracticeModes.ethSelect:
      case PracticeModes.hteSelect: {
        return (
          <Options
            options={allOptions}
            onSelect={handleSelectOption}
            selected={translation}
            isLoading={isUpdatingStats}
            eth={eth}
          />
        );
      }
      case PracticeModes.browse:
        return (
          <TextField value={card?.english} sx={{ pointerEvents: "none" }} />
        );
    }
  }, [
    mode,
    card,
    showTranslation,
    translation,
    allOptions,
    handleSelectOption,
    isUpdatingStats,
    eth,
  ]);

  useEffect(() => setTranslation(""), [showTranslation]);

  const buttonStyles: ButtonOwnProps = useMemo(
    () => ({
      size: "small",
      variant: "outlined",
      sx: { margin: "0 5px 5px 0", width: isMobile ? "50%" : "unset" },
    }),
    [isMobile]
  );

  const isLoading =
    isMarkingLearned ||
    isDeletingCard ||
    isUpdatingStats ||
    isLoadingCard ||
    isFetchingCard ||
    inTransition;

  const getCardActionsByMode = useCallback(() => {
    const CheckButton = () => (
      <Button
        {...buttonStyles}
        loading={isUpdatingStats}
        disabled={!translation || showTranslation || isLoading}
        onClick={handleCheckTranslation}
        endIcon={<QuestionMarkRounded />}
      >
        Check
      </Button>
    );
    const ForgotButton = () => (
      <Button
        {...buttonStyles}
        disabled={showTranslation || isLoading}
        loading={isUpdatingStats}
        onClick={handleToggleTranslation}
        endIcon={<SentimentVeryDissatisfiedRounded />}
      >
        Forgot
      </Button>
    );
    switch (mode) {
      case PracticeModes.ethInput:
      case PracticeModes.hteInput:
        return (
          <>
            <CheckButton />
            <ForgotButton />
          </>
        );
      case PracticeModes.ethSelect:
      case PracticeModes.hteSelect:
        return <CheckButton />;
    }
  }, [
    buttonStyles,
    mode,
    handleCheckTranslation,
    handleToggleTranslation,
    showTranslation,
    translation,
    isLoading,
    isUpdatingStats,
  ]);

  const handleMarkAsLearned = useCallback(
    () => card && markCardLearned(card.id, true),
    [markCardLearned, card]
  );

  const handleDeleteCard = useCallback(
    () => card && deleteCard(card.id),
    [deleteCard, card]
  );

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const onOpenEditModal = () => {
    stopTimer();
    setIsEdit(true);
  };
  const onCloseEditModal = () => {
    setIsEdit(false);
    timerProps.timerSessionActive && resumeTimer();
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
    f: () => !isLoading && card && !hasOptions && handleToggleTranslation(),
  };
  useHotkeys("right", () => !isLoading && getNextCard(), [getNextCard]);
  useHotkeys("Enter", () => !isLoading && handleCheckTranslation(), {
    enableOnFormTags: true,
  });
  useHotkeys(Object.keys(hotkeysConfig), ({ key }) =>
    hotkeysConfig[key as keyof typeof hotkeysConfig]?.()
  );

  if (card === undefined || isLoadingCard) return <CenteredLoader />;

  if (card === null)
    return (
      <Typography mt={3} variant="h3">
        No cards were found
      </Typography>
    );

  return (
    <Card
      variant="outlined"
      sx={{
        display: "flex",
        flexDirection: "column",
        alignContent: "space-between",
        position: "relative",
      }}
    >
      <ToastContainer containerId={TOAST_CONTAINERS_IDS.card} />
      <CardContent
        sx={
          isMobile
            ? {
                display: "flex",
                alignItems: "center",
                flexDirection: "column",
              }
            : {}
        }
      >
        {isFetchingCard ? (
          <CardSkeletonLoader />
        ) : (
          <>
            <Typography
              gutterBottom
              sx={{ color: "text.secondary", fontSize: 14 }}
            >
              Word
            </Typography>
            <Typography variant="h5" component="div">
              {eth ? card.english : card.hebrew}{" "}
              {[
                PracticeModes.browse,
                PracticeModes.hteInput,
                PracticeModes.hteSelect,
              ].includes(mode) && <UtterButton text={card.hebrew} />}
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
              {card.category.label}
            </Typography>
            {getCardBodyByMode()}
            {(mode === PracticeModes.browse || showTranslation) &&
              card.details && (
                <Typography
                  variant="body2"
                  gutterBottom
                  sx={{ display: "block", whiteSpace: "pre-wrap" }}
                  mt={2}
                >
                  {card.details}
                </Typography>
              )}
            {inTransition && mode !== PracticeModes.browse && (
              <Box mt={2}>
                <IntervalCountdown seconds={interval} />
              </Box>
            )}
          </>
        )}
      </CardContent>
      <CardActions
        sx={{
          justifyContent: isMobile ? "center" : "start",
          width: "100%",
        }}
      >
        <Stack direction={isMobile ? "column" : "row"} sx={{ width: "100%" }}>
          <Stack direction="row">{getCardActionsByMode()}</Stack>
          <Stack direction="row">
            <Button
              {...buttonStyles}
              loading={isLoadingCard}
              disabled={isLoading}
              onClick={getNextCard}
              endIcon={<NavigateNextRounded />}
            >
              Next
            </Button>
            <Button
              {...buttonStyles}
              loading={isMarkingLearned}
              disabled={isLoading || card.isLearned}
              onClick={handleMarkAsLearned}
              endIcon={<TaskAltRounded />}
            >
              Learned
            </Button>
          </Stack>
          <Stack direction="row">
            <Button
              {...buttonStyles}
              disabled={isLoading}
              onClick={onOpenEditModal}
              endIcon={<EditRounded />}
            >
              Edit
            </Button>
            <Button
              {...buttonStyles}
              loading={isDeletingCard}
              disabled={isLoading}
              onClick={handleDeleteCard}
              endIcon={<DeleteForeverRounded />}
            >
              Delete
            </Button>
          </Stack>
          {!isMobile && <HotkeysLegend />}
        </Stack>
      </CardActions>
      <EditCardModal
        open={isEdit}
        card={card}
        onClose={onCloseEditModal}
        onSuccess={(updatedData) => {
          setCard(updatedData);
        }}
      />
    </Card>
  );
};
