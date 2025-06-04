import { Button, DialogActions } from "@mui/material";
import { PopoverConfirmation } from "../popover-confirmation/popover-confirmation";
import { CardModel } from "../../models/card";
import {
  useDeleteCard,
  useMarkCardLearned,
  usePopoverConfirmation,
  useScreenSize,
} from "../../hooks";
import { useCallback, useState } from "react";

type EditCardModalActionsPropsType = {
  card: CardModel;
  onClose: () => void;
  isFormDirty: boolean;
  isUpdatePending: boolean;
};
export const EditCardModalActions = ({
  card,
  onClose,
  isFormDirty,
  isUpdatePending,
}: EditCardModalActionsPropsType) => {
  const { isMobile } = useScreenSize();

  const [isLearned, setIsLearned] = useState(card.isLearned);

  const { deleteCard, isPending: isDeletePending } = useDeleteCard();
  const handleDeleteCard = useCallback(
    () => deleteCard(card.id, { onSuccess: onClose }),
    [deleteCard, card, onClose]
  );

  const { markCardLearned, isPending: isMarkLearnedPending } =
    useMarkCardLearned();
  const handleMarkCardLearned = useCallback(
    () =>
      markCardLearned(card.id, !isLearned, {
        onSuccess: () => setIsLearned(!isLearned),
      }),
    [markCardLearned, card, isLearned]
  );

  const { confirmationProps, handleOpen, showConfirmation } =
    usePopoverConfirmation();

  const isLoading = isUpdatePending || isDeletePending || isMarkLearnedPending;

  return (
    <DialogActions>
      {isLearned ? (
        <Button
          onClick={handleMarkCardLearned}
          loading={isLoading}
          size={isMobile ? "small" : "medium"}
        >
          Unlearn
        </Button>
      ) : (
        <Button
          onClick={(e) => {
            handleOpen(
              e,
              handleMarkCardLearned,
              "Are you sure you want to mark this card as learned?"
            );
          }}
          loading={isLoading}
          color="success"
          size={isMobile ? "small" : "medium"}
        >
          Learned
        </Button>
      )}
      <Button
        onClick={(e) => {
          handleOpen(
            e,
            handleDeleteCard,
            "Are you sure you want to delete this card?"
          );
        }}
        loading={isLoading}
        color="error"
        size={isMobile ? "small" : "medium"}
      >
        Delete
      </Button>
      <Button
        onClick={onClose}
        color="primary"
        loading={isLoading}
        size={isMobile ? "small" : "medium"}
      >
        Cancel
      </Button>
      <Button
        loading={isLoading}
        disabled={!isFormDirty}
        type="submit"
        color="primary"
        size={isMobile ? "small" : "medium"}
      >
        Save
      </Button>
      {confirmationProps && (
        <PopoverConfirmation {...confirmationProps} open={showConfirmation} />
      )}
    </DialogActions>
  );
};
