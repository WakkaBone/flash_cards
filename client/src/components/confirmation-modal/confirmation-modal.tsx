import React from "react";
import { Button } from "@mui/material";
import { Warning } from "@mui/icons-material";
import { Modal } from "../modal/modal";

export enum ConfirmationModalTypes {
  info,
  warning,
  error,
}

export type ConfirmationModalPropsType = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: JSX.Element;
  type: ConfirmationModalTypes;
};

export const ConfirmationModal: React.FC<ConfirmationModalPropsType> = ({
  open,
  onClose,
  onConfirm,
  title,
  message,
  type,
}) => (
  <Modal
    open={open}
    onClose={onClose}
    title={
      <>
        {[
          ConfirmationModalTypes.error,
          ConfirmationModalTypes.warning,
        ].includes(type) ? (
          <Warning sx={{ verticalAlign: "middle", marginRight: 1 }} />
        ) : null}
        {title}
      </>
    }
    titleProps={{
      sx: {
        color: [
          ConfirmationModalTypes.error,
          ConfirmationModalTypes.warning,
        ].includes(type)
          ? "#C62828"
          : "black",
        fontWeight: "bold",
        textAlign: "center",
      },
    }}
    actions={
      <>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={onConfirm} color="primary">
          Confirm
        </Button>
      </>
    }
  >
    {message}
  </Modal>
);
