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
import { useUpdateCard } from "../../hooks";
import { useEffect } from "react";

type EditCardModalPropsType = {
  open: boolean;
  card: CardModel;
  onClose: () => void;
};
export const EditCardModal = ({
  open,
  card,
  onClose,
}: EditCardModalPropsType) => {
  const { updateCard, isPending } = useUpdateCard();

  const formProps = useForm<EditCardFormType>({
    defaultValues: {
      category: card.category,
      english: card.english,
      hebrew: card.hebrew,
    },
  });

  useEffect(() => {
    formProps.setValue("category", card.category);
    formProps.setValue("english", card.english);
    formProps.setValue("hebrew", card.hebrew);
  }, [formProps, card]);

  const onSave = async (formValues: EditCardFormType) => {
    const payload = { ...card, ...formValues };
    updateCard(payload, {
      onSuccess: () => {
        formProps.reset();
        onClose();
      },
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Card</DialogTitle>
      <form onSubmit={formProps.handleSubmit(onSave)} style={{ width: "100%" }}>
        <DialogContent>
          <EditCardForm formProps={formProps} />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose} color="primary">
            Cancel
          </Button>
          <Button
            loading={isPending}
            disabled={!formProps.formState.isDirty}
            type="submit"
            color="primary"
          >
            Save
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};
