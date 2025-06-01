import { useMutation, useQueryClient } from "@tanstack/react-query";
import {
  addCardMutation,
  addCardPrecheckMutation,
} from "../../mutations/cards";
import { AddCardPayload, ApiResponse } from "../../models/api";
import { toast } from "react-toastify";
import { MutateOptionsEnhanced } from "../../models/mutate-options-enhanced";
import { useState } from "react";
import { CardModel } from "../../models/card";
import { Box, Typography } from "@mui/material";
import {
  ConfirmationModalPropsType,
  ConfirmationModalTypes,
} from "../../components/confirmation-modal/confirmation-modal";
import { ErrorCodes, toastError } from "../../utils/error-handler";
import { QUERY_KEYS } from "../../constants";

const ConfirmAddWordModalMessage = ({
  similarWords,
}: {
  similarWords?: CardModel[];
}) => (
  <Box>
    <Typography>Similar words already exist: </Typography>
    {similarWords?.map((word) => (
      <Typography fontWeight="bold" key={word.id}>
        {word.english} - {word.hebrew}
      </Typography>
    ))}
    <Typography mt={2}>Do you still want to add it?</Typography>
  </Box>
);

export const useAddCard = () => {
  const queryClient = useQueryClient();
  const { mutate: precheckMutation, ...precheckRest } = useMutation(
    addCardPrecheckMutation
  );
  const { mutate: addMutation, ...addRest } = useMutation(addCardMutation);

  const addCard = (
    card: AddCardPayload,
    options?: MutateOptionsEnhanced<ApiResponse, unknown, AddCardPayload>
  ) =>
    addMutation(card, {
      onSuccess: (...args) => {
        toast("Card added successfully", { type: "success" });
        queryClient.invalidateQueries({ queryKey: [QUERY_KEYS.cards] });
        options?.onSuccess?.(...args);
      },
      onError: (...args) => {
        toastError(args[0]);
        options?.onError?.(...args);
      },
      onSettled(data, error, variables, context) {
        if (!data?.isSuccess) toastError(data?.error);
        options?.onSettled?.(data, error, variables, context);
      },
    });

  const [confirmationModal, setConfirmationModal] = useState<{
    open: boolean;
    similarWords?: CardModel[];
    formData?: AddCardPayload;
  }>({ open: false });

  const handleOpenConfirmationModal = (
    similarWords: CardModel[],
    payload: AddCardPayload
  ) => setConfirmationModal({ open: true, similarWords, formData: payload });

  const handleCloseConfirmationModal = () =>
    setConfirmationModal({ open: false });

  const handleConfirm = (options?: MutateOptionsEnhanced) => {
    if (!confirmationModal.formData) return;
    addCard(confirmationModal.formData, {
      ...options,
      onSuccess: (...args) => {
        handleCloseConfirmationModal();
        options?.onSuccess?.(...args);
      },
    });
  };

  const precheck = (
    card: AddCardPayload,
    options?: MutateOptionsEnhanced<ApiResponse, unknown, AddCardPayload>
  ) =>
    precheckMutation(card, {
      ...options,
      onError: (...args) => {
        toastError(args[0]);
        options?.onError?.(...args);
      },
      onSettled(data, error, variables) {
        const checkPassed = !!data?.isSuccess;
        if (checkPassed) {
          addCard(variables);
          return;
        }

        const similarWordExists =
          data?.error?.code === ErrorCodes.SimilarWordExists;
        if (!similarWordExists) toastError(data?.error);
        similarWordExists &&
          data.error &&
          handleOpenConfirmationModal(data?.error.data, variables);
      },
    });

  const confirmationModalProps: ConfirmationModalPropsType = {
    open: confirmationModal.open,
    onClose: handleCloseConfirmationModal,
    onConfirm: handleConfirm,
    title: "Similar word detected",
    message: (
      <ConfirmAddWordModalMessage
        similarWords={confirmationModal?.similarWords}
      />
    ),
    type: ConfirmationModalTypes.warning,
  };

  return {
    addCard,
    addRest,
    precheck,
    precheckRest,
    confirmationModalProps,
  };
};
