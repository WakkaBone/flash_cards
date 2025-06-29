import {
  DeleteForeverRounded,
  EditRounded,
  NavigateNextRounded,
  QuestionMarkRounded,
  SentimentVeryDissatisfiedRounded,
  TaskAltRounded,
} from "@mui/icons-material";
import {
  Button,
  ButtonOwnProps,
  Stack,
  CardActions as CardActionsContainer,
} from "@mui/material";
import { HotkeysLegend } from "./hotkeys-legend";
import { useScreenSize } from "../../hooks";
import { useMemo } from "react";
import { PracticeModes } from "../../models/practice-mode";
import { usePracticeContext } from "../../context/practice-context";

export const CardActions = () => {
  const { isMobile } = useScreenSize();

  const {
    practiceMode: mode,
    cardState: { card },
    translationState: { translation, showTranslation },
    loadersState: {
      isLoading,
      isUpdatingStats,
      isMarkingLearned,
      isDeletingCard,
      isLoadingCard,
    },
    modalsState: {
      editModal: { onOpen: onOpenEditModal },
    },
    actions: {
      handleMarkAsLearned,
      handleDeleteCard,
      getNextCard,
      handleCheckTranslation,
      handleToggleTranslation,
    },
  } = usePracticeContext();

  const buttonStyles: ButtonOwnProps = useMemo(
    () => ({
      size: "small",
      variant: "outlined",
      sx: { margin: "0 5px 5px 0", width: isMobile ? "50%" : "unset" },
    }),
    [isMobile]
  );

  const CardActionsByMode = () => {
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
      default:
        return <></>;
    }
  };

  if (!card) return null;

  return (
    <CardActionsContainer
      sx={{
        justifyContent: isMobile ? "center" : "start",
        width: "100%",
      }}
    >
      <Stack direction={isMobile ? "column" : "row"} sx={{ width: "100%" }}>
        <Stack direction="row">
          <CardActionsByMode />
        </Stack>
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
    </CardActionsContainer>
  );
};
