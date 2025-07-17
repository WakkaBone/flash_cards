import {
  TableCell,
  TableCellProps,
  TextField,
  TextFieldProps,
  Typography,
} from "@mui/material";
import { MouseEvent, PropsWithChildren, useCallback } from "react";
import { useTTS } from "../../hooks";
import { BooleanifiedVerbConjugations } from "../../hooks/cards/use-card-translation";
import {
  Genders,
  Quantities,
  VerbConjugations,
  VerbTenses,
} from "../../models/verb";

export const GENDERS: Genders[] = [Genders.Male, Genders.Female];
export const QUANTITIES: Quantities[] = [
  Quantities.Singular,
  Quantities.Plural,
];

export interface VerbTenseTablePropsType<Tense extends keyof VerbTenses> {
  forms: VerbConjugations[Tense];
  isPractice?: boolean;
  practiceProps?: {
    onInput?: (input: VerbConjugations[Tense]) => void;
    results?: BooleanifiedVerbConjugations[Tense];
    showTranslation?: boolean;
    verbFormsSubmitted: boolean;
  };
}

export const CenteredText = ({ children }: PropsWithChildren) => (
  <Typography align="center" sx={{ display: "block", p: 0, m: 0 }}>
    {children}
  </Typography>
);

export const TableCellWithVoiceover = ({
  children,
  ...props
}: PropsWithChildren<TableCellProps>) => {
  const { tts, isUttering } = useTTS();

  const voiceCellContent = useCallback(
    (e: MouseEvent<HTMLTableCellElement>) => {
      const cellText = e.currentTarget.textContent;
      if (cellText && !isUttering) tts(cellText);
    },
    [tts, isUttering]
  );

  return (
    <TableCell {...props} onClick={voiceCellContent}>
      {children}
    </TableCell>
  );
};

type VoiceoverWrapperPropsType = {
  shouldPlay: boolean;
  value: string;
};
export const VoiceoverWrapper = ({
  shouldPlay,
  value,
  children,
}: PropsWithChildren<VoiceoverWrapperPropsType>) => {
  const { tts, isUttering } = useTTS();

  const voiceOver = useCallback(
    () => shouldPlay && !isUttering && tts(value),
    [shouldPlay, isUttering, tts, value]
  );

  return <div onClick={voiceOver}>{children}</div>;
};

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
