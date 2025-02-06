import {
  Button,
  ButtonOwnProps,
  Card,
  CardActions,
  CardContent,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { PracticeFilersType, PracticeModes } from "../../pages/practice-page";
import { useCallback, useEffect, useMemo, useState } from "react";
import { categoryMapper } from "../../utils/mappers";
import { STATISTICS_ACTIONS } from "../../models/api";
import { ToastContainer, toast } from "react-toastify";
import {
  useMarkCardLearned,
  useDeleteCard,
  useRandomCard,
  useScreenSize,
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
import { CardsService } from "../../services/cards-service";
import { toastError } from "../../utils/error-handler";

type WordCardPropsType = {
  mode: PracticeModes;
  filters: PracticeFilersType;
  timerProps: {
    isEnabled: boolean;
    timeLeft: number | null;
    stopTimer: () => void;
    startTimer: () => void;
  };
};

export const WordCard = ({ mode, filters, timerProps }: WordCardPropsType) => {
  const { isMobile, isPortrait } = useScreenSize();

  const {
    cardData,
    isLoading: isLoadingCard,
    isFetching: isFetchingCard,
    getAnotherCard,
    updateCardStats,
    updateStatsRest: { isPending: isUpdatingStats },
  } = useRandomCard(filters);
  const { markCardLearned, isPending: isMarkingLearned } = useMarkCardLearned();
  const { deleteCard, isPending: isDeletingCard } = useDeleteCard();
  const {
    isEnabled: isTimerEnabled,
    timeLeft,
    stopTimer,
    startTimer,
  } = timerProps;

  const [card, setCard] = useState<CardModel | undefined>(cardData);

  useEffect(() => cardData && setCard(cardData), [cardData]);

  const [translation, setTranslation] = useState<string>("");
  const [showTranslation, setShowTranslation] = useState<boolean>(false);

  const getNextCard = useCallback(() => {
    stopTimer();
    getAnotherCard().then(() => {
      setTranslation("");
      setShowTranslation(false);
      startTimer();
    });
  }, [getAnotherCard, startTimer, stopTimer]);

  const isCorrectAnswer = useCallback(() => {
    if (!card) return;
    const correctAnswer =
      mode === PracticeModes.eth ? card.hebrew : card.english;
    return (
      translation.trim().toLowerCase() === correctAnswer.trim().toLowerCase()
    );
  }, [mode, card, translation]);

  const handleCheckTranslation = useCallback(() => {
    if (!card || mode === PracticeModes.browse || !translation) return;
    const isCorrect = isCorrectAnswer();

    stopTimer();
    updateCardStats(
      isCorrect ? STATISTICS_ACTIONS.Correct : STATISTICS_ACTIONS.Wrong,
      {
        onSuccess: () => {
          if (!isCorrect) return;
          const timeBeforeGetNextCard = 2000;
          setShowTranslation(true);
          setTimeout(() => getNextCard(), timeBeforeGetNextCard);
        },
      }
    );
  }, [
    card,
    mode,
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

  const getCardBodyByMode = useCallback(() => {
    switch (mode) {
      case PracticeModes.eth:
      case PracticeModes.hte:
        return showTranslation ? (
          <TextField
            value={card?.[PracticeModes.eth === mode ? "hebrew" : "english"]}
            disabled
          />
        ) : (
          <TextField
            value={translation}
            placeholder="Enter translation"
            onChange={(e) => setTranslation(e.target.value)}
          />
        );
      case PracticeModes.browse:
        return (
          <TextField value={card?.english} sx={{ pointerEvents: "none" }} />
        );
    }
  }, [mode, card, showTranslation, translation]);

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
    isFetchingCard;

  const handleTimeUp = useCallback(() => {
    if (!card) return;
    if (mode === PracticeModes.browse) {
      getNextCard();
      return;
    }

    //TODO investigate why cannot use hook here
    const isCorrect = isCorrectAnswer();
    CardsService.updateCardStats(
      card.id,
      isCorrect ? STATISTICS_ACTIONS.Correct : STATISTICS_ACTIONS.Wrong
    )
      .then(() => {
        toast(isCorrect ? "Correct!" : "Wrong!", {
          type: isCorrect ? "success" : "error",
          autoClose: 500,
        });
        getNextCard();
      })
      .catch(() => toastError());
  }, [getNextCard, card, mode, isCorrectAnswer]);

  useEffect(() => {
    if (!isTimerEnabled) return;
    timeLeft === 0 && handleTimeUp();
  }, [isTimerEnabled, timeLeft, handleTimeUp]);

  const getCardActionsByMode = useCallback(() => {
    switch (mode) {
      case PracticeModes.eth:
      case PracticeModes.hte:
        return (
          <Stack direction="row">
            <Button
              {...buttonStyles}
              loading={isUpdatingStats}
              disabled={!translation || showTranslation || isLoading}
              onClick={handleCheckTranslation}
              endIcon={<QuestionMarkRounded />}
            >
              Check
            </Button>
            <Button
              {...buttonStyles}
              disabled={showTranslation || isLoading}
              loading={isUpdatingStats}
              onClick={handleToggleTranslation}
              endIcon={<SentimentVeryDissatisfiedRounded />}
            >
              Forgot
            </Button>
          </Stack>
        );
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

  const handleMarkAsLearned = useCallback(() => {
    if (!card) return;
    markCardLearned(card.id, {
      onSuccess: () => getNextCard(),
    });
  }, [markCardLearned, getNextCard, card]);

  const handleDeleteCard = useCallback(() => {
    if (!card) return;
    deleteCard(card.id, {
      onSuccess: () => getNextCard(),
    });
  }, [deleteCard, getNextCard, card]);

  const [isEdit, setIsEdit] = useState<boolean>(false);
  const onOpenEditModal = () => setIsEdit(true);
  const onCloseEditModal = () => setIsEdit(false);

  useHotkeys("right", () => getNextCard(), []);
  useHotkeys("Enter", () => handleCheckTranslation(), {
    enableOnFormTags: true,
  });

  if (isLoadingCard) return <CenteredLoader />;
  if (!card) return null;

  return (
    <Card
      variant="outlined"
      sx={{
        height: isPortrait ? "50vh" : "70vh",
        display: "flex",
        flexDirection: "column",
        alignContent: "space-between",
        position: "relative",
      }}
    >
      <ToastContainer />
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
              {mode === PracticeModes.eth ? card.english : card.hebrew}
            </Typography>
            <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
              {categoryMapper[card.category]}
            </Typography>
            {getCardBodyByMode()}
            {(mode === PracticeModes.browse || showTranslation) &&
              card.details && (
                <Typography
                  variant="caption"
                  gutterBottom
                  sx={{ display: "block", whiteSpace: "pre-wrap" }}
                  mt={2}
                >
                  {card.details}
                </Typography>
              )}
          </>
        )}
      </CardContent>
      <CardActions
        sx={{
          justifyContent: isMobile ? "center" : "start",
          position: "absolute",
          bottom: 0,
          width: "100%",
        }}
      >
        <Stack direction={isMobile ? "column" : "row"}>
          {getCardActionsByMode()}
          <Stack direction="row">
            <Button
              {...buttonStyles}
              loading={isLoadingCard}
              disabled={isLoading}
              onClick={() => getNextCard()}
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
