import { Button, Popover, Stack, Typography } from "@mui/material";

export type PopoverConfirmationPropsType = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  confirmationText: string;
  anchorEl?: HTMLElement | null;
};
export const PopoverConfirmation = ({
  open,
  onClose,
  onConfirm,
  confirmationText,
  anchorEl,
}: PopoverConfirmationPropsType) => (
  <Popover
    open={open}
    anchorEl={anchorEl}
    onClose={onClose}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    PaperProps={{
      style: {
        padding: "10px",
        width: "200px",
        textAlign: "center",
      },
    }}
  >
    <Typography variant="body2" gutterBottom>
      {confirmationText}
    </Typography>
    <Stack direction={"row"} spacing={1} mt={1}>
      <Button
        variant="contained"
        color="primary"
        onClick={onConfirm}
        size="small"
      >
        Confirm
      </Button>
      <Button variant="outlined" color="primary" onClick={onClose} size="small">
        Cancel
      </Button>
    </Stack>
  </Popover>
);
