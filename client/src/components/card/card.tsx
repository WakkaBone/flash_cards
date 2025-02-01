import {
  Button,
  Card,
  CardActions,
  CardContent,
  CircularProgress,
  TextField,
  Typography,
} from "@mui/material";
import { PracticeModes } from "../../pages/practice-page";
import { useCallback, useEffect, useState } from "react";
import { categoryMapper } from "../../utils/mappers";
import { STATISTICS_ACTIONS } from "../../models/api";
import { ToastContainer } from "react-toastify";
import { useMarkCardLearned, useDeleteCard, useRandomCard } from "../../hooks";

type WordCardPropsType = {
  mode: PracticeModes;
};

export const WordCard = ({ mode }: WordCardPropsType) => {
  const { cardData, isLoading, getAnotherCard, updateCardStats } =
    useRandomCard();
  const { markCardLearned, isPending: isMarkingLearned } = useMarkCardLearned();
  const { deleteCard, isPending: isDeletingCard } = useDeleteCard();

  const [translation, setTranslation] = useState<string>("");
  const [showTranslation, setIsShowTranslation] = useState<boolean>(false);

  const getNextCard = useCallback(() => {
    getAnotherCard();
    setTranslation("");
    setIsShowTranslation(false);
  }, [getAnotherCard]);

  const handleCheckTranslation = useCallback(() => {
    if (!cardData || mode === PracticeModes.browse || !translation) return;
    const correctAnswer =
      mode === PracticeModes.eth ? cardData.hebrew : cardData.english;
    const isCorrect =
      translation.trim().toLowerCase() === correctAnswer.trim().toLowerCase();

    updateCardStats(
      isCorrect ? STATISTICS_ACTIONS.Correct : STATISTICS_ACTIONS.Wrong,
      {
        onSuccess: () => isCorrect && getNextCard(),
      }
    );
  }, [cardData, mode, translation, updateCardStats, getNextCard]);

  const handleToggleTranslation = useCallback(
    () => setIsShowTranslation((val) => !val),
    []
  );

  const getCardBodyByMode = useCallback(() => {
    switch (mode) {
      case PracticeModes.eth:
      case PracticeModes.hte:
        return showTranslation ? (
          cardData?.[PracticeModes.eth === mode ? "hebrew" : "english"]
        ) : (
          <TextField
            value={translation}
            placeholder="Enter translation"
            onChange={(e) => setTranslation(e.target.value)}
          />
        );
      case PracticeModes.browse:
        return <Typography variant="body2">{cardData?.english}</Typography>;
    }
  }, [mode, cardData, showTranslation, translation]);

  useEffect(() => setTranslation(""), [showTranslation]);

  const getCardActionsByMode = useCallback(() => {
    switch (mode) {
      case PracticeModes.eth:
      case PracticeModes.hte:
        return (
          <>
            {!showTranslation && (
              <Button
                disabled={!translation}
                size="small"
                onClick={handleCheckTranslation}
              >
                Check
              </Button>
            )}
            <Button size="small" onClick={handleToggleTranslation}>
              {showTranslation ? "Hide translation" : "Show translation"}
            </Button>
          </>
        );
      case PracticeModes.browse:
        return (
          <Button size="small" onClick={() => getAnotherCard()}>
            Next
          </Button>
        );
    }
  }, [
    mode,
    getAnotherCard,
    handleCheckTranslation,
    handleToggleTranslation,
    showTranslation,
    translation,
  ]);

  const handleMarkAsLearned = useCallback(() => {
    if (!cardData) return;
    markCardLearned(cardData.id, {
      onSuccess: () => getNextCard(),
    });
  }, [markCardLearned, getNextCard, cardData]);

  const handleDeleteCard = useCallback(() => {
    if (!cardData) return;
    deleteCard(cardData.id, {
      onSuccess: () => getNextCard(),
    });
  }, [deleteCard, getNextCard, cardData]);

  if (isLoading) return <CircularProgress />;
  if (!cardData) return null;

  return (
    <Card variant="outlined">
      <ToastContainer />
      <CardContent>
        <Typography gutterBottom sx={{ color: "text.secondary", fontSize: 14 }}>
          Word
        </Typography>
        <Typography variant="h5" component="div">
          {mode === PracticeModes.eth ? cardData.english : cardData.hebrew}
        </Typography>
        <Typography sx={{ color: "text.secondary", mb: 1.5 }}>
          {categoryMapper[cardData.category]}
        </Typography>
        {getCardBodyByMode()}
      </CardContent>
      <CardActions>
        {getCardActionsByMode()}
        {cardData.isLearned ? (
          <Button disabled>Learned</Button>
        ) : (
          <Button loading={isMarkingLearned} onClick={handleMarkAsLearned}>
            Mark as learned
          </Button>
        )}
        <Button loading={isDeletingCard} onClick={handleDeleteCard}>
          Delete card
        </Button>
      </CardActions>
    </Card>
  );
};
