import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { CardModel } from "../../models/card";
import { EditCardForm, EditCardFormType } from "./edit-card-form";
import { useForm } from "react-hook-form";
import { useUpdateCard } from "../../hooks";
import { useEffect } from "react";
import { format } from "date-fns";
import { EditCardReadonlyData } from "./edit-card-readonly-data";
import { EditCardModalActions } from "./edit-card-modal-actions";

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
  const createdAt = card.createdAt
    ? format(new Date(card.createdAt), "dd/MM/yyyy HH:mm")
    : "";
  const lastPractice = card.lastReviewDate
    ? format(new Date(card.lastReviewDate.seconds * 1000), "dd/MM/yyyy HH:mm")
    : "";
  const hasPracticed = lastPractice !== createdAt;

  const formProps = useForm<EditCardFormType>({
    defaultValues: {
      category: card.category,
      english: card.english,
      hebrew: card.hebrew,
      details: card.details,
      priority: card.priority,
      createdAt: createdAt,
      lastPractice: !hasPracticed ? "Not practiced" : lastPractice,
      correctAnswers: card.statistics.correct,
      wrongAnswers: card.statistics.wrong,
    },
  });

  useEffect(() => {
    formProps.reset({
      category: card.category,
      english: card.english,
      hebrew: card.hebrew,
      details: card.details,
      priority: card.priority,
      createdAt: createdAt,
      lastPractice: !hasPracticed ? "Not practiced" : lastPractice,
      correctAnswers: card.statistics.correct,
      wrongAnswers: card.statistics.wrong,
    });
  }, [card, formProps, createdAt, hasPracticed, lastPractice]);

  const { updateCard, isPending } = useUpdateCard();
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

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Card</DialogTitle>
      <form onSubmit={formProps.handleSubmit(onSave)} style={{ width: "100%" }}>
        <DialogContent>
          <EditCardReadonlyData formProps={formProps} />
          <EditCardForm formProps={formProps} />
        </DialogContent>
        <EditCardModalActions
          isFormDirty={formProps.formState.isDirty}
          card={card}
          onClose={onClose}
          isUpdatePending={isPending}
        />
      </form>
    </Dialog>
  );
};
