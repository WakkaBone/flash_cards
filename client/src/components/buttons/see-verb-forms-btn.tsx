import { Chip, ChipOwnProps } from "@mui/material";

type SeeFormsButtonPropsType = ChipOwnProps & { onClick: () => void };
export const SeeVerbFormsButton = (props: SeeFormsButtonPropsType) => (
  <Chip label="See forms" size="small" sx={{ cursor: "pointer" }} {...props} />
);
