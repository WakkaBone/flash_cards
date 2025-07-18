import { TextField, TextFieldProps } from "@mui/material";

type VerbFormInputPropsType = TextFieldProps & {
  shouldShowFeedback: boolean;
  isCorrect: boolean;
};
export const VerbFormInput = ({
  shouldShowFeedback,
  isCorrect,
  ...props
}: VerbFormInputPropsType) => (
  <TextField
    fullWidth
    size="small"
    variant="outlined"
    error={shouldShowFeedback && !isCorrect}
    helperText={
      shouldShowFeedback ? (isCorrect ? "✔️ Correct" : "❌ Incorrect") : ""
    }
    {...props}
  />
);
