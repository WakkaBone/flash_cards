import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  Genders,
  Quantities,
  Tenses,
  VerbConjugations,
} from "../../models/verb";
import {
  QUANTITIES,
  TableCellWithVoiceover,
  VerbFormInput,
  VerbTenseTablePropsType,
  VoiceoverWrapper,
} from "./shared";
import { DEFAULT_VERB_FORMS } from "../../hooks/cards/use-card-translation";

type PresentTenseTablePropsType = VerbTenseTablePropsType<Tenses.Present>;

export const PresentTenseTable = ({
  forms,
  isPractice = false,
  practiceProps,
}: PresentTenseTablePropsType) => {
  const [inputs, setInputs] = useState<VerbConjugations[Tenses.Present]>(
    DEFAULT_VERB_FORMS.present
  );

  const handleChange = (
    group: keyof VerbConjugations[Tenses.Present],
    gender: keyof VerbConjugations[Tenses.Present][Quantities.Singular],
    value: string
  ) => {
    setInputs((prev) => ({
      ...prev,
      [group]: {
        ...prev[group],
        [gender]: value,
      },
    }));
  };

  useEffect(() => {
    if (isPractice) practiceProps?.onInput?.(inputs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs, isPractice, practiceProps?.onInput]);

  useEffect(() => {
    if (practiceProps?.showTranslation) setInputs(forms);
  }, [practiceProps?.showTranslation, forms]);

  const renderTextField = (
    group: keyof VerbConjugations[Tenses.Present],
    gender: keyof VerbConjugations[Tenses.Present][Quantities.Singular]
  ) => {
    const value = inputs[group][gender];
    const isCorrect = practiceProps?.results?.[group][gender];
    const shouldShowFeedback =
      practiceProps?.verbFormsSubmitted && !practiceProps?.showTranslation;

    return (
      <VoiceoverWrapper
        shouldPlay={!!practiceProps?.showTranslation}
        value={value}
      >
        <VerbFormInput
          value={value}
          disabled={!!practiceProps?.showTranslation}
          onChange={(e) => handleChange(group, gender, e.target.value)}
          isCorrect={!!isCorrect}
          shouldShowFeedback={!!shouldShowFeedback}
        />
      </VoiceoverWrapper>
    );
  };

  const renderCell = (
    group: keyof VerbConjugations[Tenses.Present],
    gender: keyof VerbConjugations[Tenses.Present][Quantities.Singular]
  ) => {
    const correctValue = forms[group][gender];

    return (
      <TableCell>
        {isPractice ? (
          renderTextField(group, gender)
        ) : (
          <TableCellWithVoiceover>
            <strong>{correctValue}</strong>
          </TableCellWithVoiceover>
        )}
      </TableCell>
    );
  };

  return (
    <TableContainer component={Paper} sx={{ margin: "auto", mt: 2 }}>
      <Typography variant="h6" align="center" sx={{ mt: 2 }}>
        Present Tense (הווה)
      </Typography>
      <Table>
        <TableHead>
          <TableRow>
            <TableCell />
            <TableCell>
              <strong>Masculine</strong>
            </TableCell>
            <TableCell>
              <strong>Feminine</strong>
            </TableCell>
          </TableRow>
        </TableHead>
        <TableBody>
          {QUANTITIES.map((group) => (
            <TableRow key={group}>
              <TableCell>{group[0].toUpperCase() + group.slice(1)}</TableCell>
              {renderCell(group, Genders.Male)}
              {renderCell(group, Genders.Female)}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableContainer>
  );
};
