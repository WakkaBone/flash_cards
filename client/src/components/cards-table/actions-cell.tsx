import { Box, Button } from "@mui/material";
import { CardModel } from "../../models/card";
import { GridDeleteIcon } from "@mui/x-data-grid";
import { EditNotificationsOutlined } from "@mui/icons-material";
import { useMarkCardLearned } from "../../hooks/use-mark-learned";
import { useCallback, useState } from "react";
import { useDeleteCard } from "../../hooks/use-delete-card";
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
    <Box>
      <Button
        size="small"
        onClick={handleDeleteCard}
        loading={isDeletePending}
        title="Remove"
      >
        <GridDeleteIcon />
      </Button>
      <Button onClick={onOpenEditModal} size="small" title="Edit">
        <EditNotificationsOutlined />
      </Button>
      <Button
        disabled={isLearned}
        variant="contained"
        onClick={handleMarkAsLearned}
        loading={isMarkLearnedPending}
        size="small"
      >
        Learned
      </Button>
      <EditCardModal open={isEdit} card={card} onClose={onCloseEditModal} />
    </Box>
  );
};
