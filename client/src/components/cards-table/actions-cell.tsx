import { Button, Tooltip } from "@mui/material";
import { CardModel } from "../../models/card";
import {
  DeleteForeverRounded,
  EditRounded,
  TaskAltRounded,
} from "@mui/icons-material";
import { useCallback, useState } from "react";
import { useDeleteCard, useMarkCardLearned } from "../../hooks";
import { EditCardModal } from "../edit-card-modal/edit-card-modal";

export const ActionsCell = ({ card }: { card: CardModel }) => {
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const isLearned = !!card.isLearned;
  const { markCardLearned, isPending: isMarkLearnedPending } =
    useMarkCardLearned();
  const handleMarkAsLearned = useCallback(
    () => markCardLearned(card.id),
    [markCardLearned, card]
  );

  const { deleteCard, isPending: isDeletePending } = useDeleteCard();
  const handleDeleteCard = useCallback(
    () => deleteCard(card.id),
    [deleteCard, card]
  );

  const onOpenEditModal = () => setIsEdit(true);
  const onCloseEditModal = () => setIsEdit(false);

  return (
    <>
      <Button size="small" onClick={handleDeleteCard} loading={isDeletePending}>
        <Tooltip title="Delete card">
          <DeleteForeverRounded />
        </Tooltip>
      </Button>
      <Button onClick={onOpenEditModal} size="small" title="Edit">
        <Tooltip title="Edit card">
          <EditRounded />
        </Tooltip>
      </Button>
      <Button
        disabled={isLearned}
        onClick={handleMarkAsLearned}
        loading={isMarkLearnedPending}
        size="small"
      >
        <Tooltip title="Mark as learned">
          <TaskAltRounded />
        </Tooltip>
      </Button>
      <EditCardModal open={isEdit} card={card} onClose={onCloseEditModal} />
    </>
  );
};
