import { useState } from "react";
import { PopoverConfirmationPropsType } from "../components/popover-confirmation/popover-confirmation";

export const usePopoverConfirmation = () => {
  const [showConfirmation, setShowConfirmation] = useState(false);

  const onClose = () => setShowConfirmation(false);

  const [confirmationProps, setConfirmationProps] =
    useState<Omit<PopoverConfirmationPropsType, "open">>();

  const handleOpen = (
    event: React.SyntheticEvent<HTMLButtonElement>,
    onConfirm: () => void,
    confirmationText: string
  ) => {
    setShowConfirmation(true);
    setConfirmationProps({
      anchorEl: event.currentTarget,
      onClose,
      onConfirm: () => {
        onConfirm();
        onClose();
      },
      confirmationText,
    });
  };

  return { handleOpen, confirmationProps, showConfirmation };
};
