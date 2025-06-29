import { Button, Tooltip } from "@mui/material";
import { CardModel } from "../../models/card";
import {
  DeleteForeverRounded,
  EditRounded,
  KeyboardReturn,
  TaskAltRounded,
} from "@mui/icons-material";
import { useCallback } from "react";
import { useDeleteCard, useMarkCardLearned, useModal } from "../../hooks";
import { EditCardModal } from "../edit-card-modal/edit-card-modal";

export const ActionsCell = ({ card }: { card: CardModel }) => {
  const editModal = useModal();

  const isLearned = !!card.isLearned;
  const { markCardLearned, isPending: isMarkLearnedPending } =
    useMarkCardLearned();
  const handleMarkAsLearned = useCallback(
    () => markCardLearned(card.id, !isLearned),
    [markCardLearned, card, isLearned]
  );

  const { deleteCard, isPending: isDeletePending } = useDeleteCard();
  const handleDeleteCard = useCallback(
    () => deleteCard(card.id),
    [deleteCard, card]
  );

  return (
    <>
      <Button size="small" onClick={handleDeleteCard} loading={isDeletePending}>
        <Tooltip title="Delete card">
          <DeleteForeverRounded />
        </Tooltip>
      </Button>
      <Button onClick={editModal.onOpen} size="small" title="Edit">
        <Tooltip title="Edit card">
          <EditRounded />
        </Tooltip>
      </Button>
      <Button
        onClick={handleMarkAsLearned}
        loading={isMarkLearnedPending}
        size="small"
        color={isLearned ? "error" : "primary"}
      >
        <Tooltip title={isLearned ? "Mark as not learned" : "Mark as learned"}>
          {isLearned ? <KeyboardReturn /> : <TaskAltRounded />}
        </Tooltip>
      </Button>
      <EditCardModal {...editModal} card={card} />
    </>
  );
};
