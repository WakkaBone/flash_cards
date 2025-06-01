import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { CardModel } from "../../models/card";
import { EditCardForm, EditCardFormType } from "./edit-card-form";
import { useForm } from "react-hook-form";
import {
  useDeleteCard,
  usePopoverConfirmation,
  useUpdateCard,
} from "../../hooks";
import { useCallback, useEffect } from "react";
import { PopoverConfirmation } from "../popover-confirmation/popover-confirmation";

type EditCardModalPropsType = {
  open: boolean;
  card: CardModel;
  onClose: () => void;
  onSuccess?: (updatedData: CardModel) => void;
};
export const EditCardModal = ({
  open,
  card,
  onClose,
  onSuccess,
}: EditCardModalPropsType) => {
  const { updateCard, isPending } = useUpdateCard();

  const formProps = useForm<EditCardFormType>({
    defaultValues: {
      category: card.category,
      english: card.english,
      hebrew: card.hebrew,
      details: card.details,
      priority: card.priority,
    },
  });

  useEffect(() => {
    formProps.reset({
      category: card.category,
      english: card.english,
      hebrew: card.hebrew,
      details: card.details,
      priority: card.priority,
    });
  }, [card, formProps]);

  const onSave = async (formValues: EditCardFormType) => {
    const payload = { ...card, ...formValues };
    updateCard(payload, {
      onSuccess: () => {
        formProps.reset(formValues);
        onClose();
        onSuccess?.(payload);
      },
    });
  };

  const { deleteCard, isPending: isDeletePending } = useDeleteCard();
  const handleDeleteCard = useCallback(
    () => deleteCard(card.id, { onSuccess: onClose }),
    [deleteCard, card, onClose]
  );
  const { confirmationProps, handleOpen, showConfirmation } =
    usePopoverConfirmation();

  const isLoading = isPending || isDeletePending;

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Card</DialogTitle>
      <form onSubmit={formProps.handleSubmit(onSave)} style={{ width: "100%" }}>
        <DialogContent>
          <EditCardForm formProps={formProps} />
        </DialogContent>
        <DialogActions>
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
          >
            Delete
          </Button>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            loading={isLoading}
            disabled={!formProps.formState.isDirty}
            type="submit"
            color="primary"
          >
            Save
          </Button>
          {confirmationProps && (
            <PopoverConfirmation
              {...confirmationProps}
              open={showConfirmation}
            />
          )}
        </DialogActions>
      </form>
    </Dialog>
  );
};
