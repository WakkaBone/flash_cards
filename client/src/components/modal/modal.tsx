import {
  Dialog,
  DialogActions,
  DialogActionsProps,
  DialogContent,
  DialogContentProps,
  DialogProps,
  DialogTitle,
  DialogTitleProps,
} from "@mui/material";
import { PropsWithChildren } from "react";

type ModalProps = Omit<DialogProps, "title"> & {
  title?: React.ReactNode;
  titleProps?: DialogTitleProps;
  contentProps?: DialogContentProps;
  actions?: React.ReactNode;
  actionsProps?: DialogActionsProps;
};
export const Modal = ({
  children,
  title,
  titleProps,
  contentProps,
  actions,
  actionsProps,
  ...dialogProps
}: PropsWithChildren<ModalProps>) => (
  <Dialog {...dialogProps}>
    {title && <DialogTitle {...titleProps}>{title}</DialogTitle>}
    <DialogContent {...contentProps}>{children}</DialogContent>
    {actions && <DialogActions {...actionsProps}>{actions}</DialogActions>}
  </Dialog>
);
