import { Button } from "@mui/material";
import { CardModel } from "../../models/card";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { EditNotificationsOutlined } from "@mui/icons-material";
import { useMarkCardLearned } from "../../hooks/use-mark-learned";
import { useCallback } from "react";
import { useDeleteCard } from "../../hooks/use-delete-card";

export const ActionsCell = ({ card }: { card: CardModel }) => {
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

  return (
    <>
      <Button
        size="small"
        onClick={handleDeleteCard}
        loading={isDeletePending}
        title="Remove"
      >
        <GridDeleteIcon />
      </Button>
      <Button size="small" title="Edit">
        <EditNotificationsOutlined />
      </Button>
      <Button
        disabled={isLearned}
        onClick={handleMarkAsLearned}
        loading={isMarkLearnedPending}
        size="small"
      >
        {isLearned ? "Learned" : "Mark as Learned"}
      </Button>
    </>
  );
};
