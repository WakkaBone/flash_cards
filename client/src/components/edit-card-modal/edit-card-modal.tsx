import { Dialog, DialogContent, DialogTitle } from "@mui/material";
import { CardModel } from "../../models/card";
import { EditCardForm, EditCardFormType } from "./edit-card-form";
import { useForm } from "react-hook-form";
import { useUpdateCard } from "../../hooks";
import { useEffect, useState } from "react";
import { isMatch } from "date-fns";
import { EditCardReadonlyData } from "./edit-card-readonly-data";
import { EditCardModalActions } from "./edit-card-modal-actions";
import { DATE_TIME_FORMAT, formatDateTime } from "../../utils/date-time";
import { VerbConjugationsModal } from "../verb-conjugations-modal/verb-conjugations-modal";
import { MAIN_CATEGORIES } from "../../constants";
import { SeeVerbFormsButton } from "../buttons/see-verb-forms-btn";

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
    ? isMatch(card.createdAt, DATE_TIME_FORMAT) //check if a string is already formatted
      ? card.createdAt
      : formatDateTime(card.createdAt)
    : "";
  const lastPractice = card.lastReviewDate
    ? formatDateTime(card.lastReviewDate.seconds * 1000)
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

  const cardIsVerb = card?.category.id === MAIN_CATEGORIES.verb;
  const [verbFormsModalOpen, setVerbFormsModalOpen] = useState<boolean>(false);
  const onOpenVerbFormsModal = () => cardIsVerb && setVerbFormsModalOpen(true);
  const onCloseVerbFormsModal = () => setVerbFormsModalOpen(false);

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit Card</DialogTitle>
      <form onSubmit={formProps.handleSubmit(onSave)} style={{ width: "100%" }}>
        <DialogContent>
          <EditCardReadonlyData formProps={formProps} />
          <EditCardForm formProps={formProps} />
          {cardIsVerb && (
            <SeeVerbFormsButton
              onClick={onOpenVerbFormsModal}
              sx={{ mt: 1, cursor: "pointer" }}
            />
          )}
          <VerbConjugationsModal
            open={verbFormsModalOpen}
            infinitive={card.hebrew || ""}
            onClose={onCloseVerbFormsModal}
          />
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
