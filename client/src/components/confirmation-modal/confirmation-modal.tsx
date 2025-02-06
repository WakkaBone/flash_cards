import React from "react";
import {
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Button,
} from "@mui/material";
import { Warning } from "@mui/icons-material";

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
  <Dialog open={open} onClose={onClose}>
    <DialogTitle
      sx={{
        color: [
          ConfirmationModalTypes.error,
          ConfirmationModalTypes.warning,
        ].includes(type)
          ? "#C62828"
          : "black",
        fontWeight: "bold",
        textAlign: "center",
      }}
    >
      {[ConfirmationModalTypes.error, ConfirmationModalTypes.warning].includes(
        type
      ) ? (
        <Warning sx={{ verticalAlign: "middle", marginRight: 1 }} />
      ) : null}
      {title}
    </DialogTitle>
    <DialogContent>{message}</DialogContent>
    <DialogActions>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button onClick={onConfirm} color="primary">
        Confirm
      </Button>
    </DialogActions>
  </Dialog>
);
