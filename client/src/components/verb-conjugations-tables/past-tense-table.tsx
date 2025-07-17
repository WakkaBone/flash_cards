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
  PastTenseConjugations,
  Quantities,
  Tenses,
  VerbConjugations,
} from "../../models/verb";
import {
  CenteredText,
  TableCellWithVoiceover,
  VerbFormInput,
  VerbTenseTablePropsType,
  VoiceoverWrapper,
} from "./shared";
import { DEFAULT_VERB_FORMS } from "../../hooks/cards/use-card-translation";
import { useScreenSize } from "../../hooks";

type PastTenseTablePropsType = VerbTenseTablePropsType<Tenses.Past>;

export const PastTenseTable = ({
  forms,
  isPractice = false,
  practiceProps,
}: PastTenseTablePropsType) => {
  const { isMobile } = useScreenSize();

  const [inputs, setInputs] = useState<VerbConjugations[Tenses.Past]>(
    DEFAULT_VERB_FORMS.past
  );

  const handleInputChange = (
    person: keyof PastTenseConjugations,
    number: Quantities,
    gender: Genders | null,
    value: string
  ) => {
    setInputs((prev) => {
      const updated = { ...prev };
      const currentVal = updated[person][number];

      if (gender) {
        if (typeof currentVal === "object" && currentVal !== null) {
          updated[person][number] = {
            ...currentVal,
            [gender]: value,
          };
        } else {
          updated[person][number] = { [gender]: value } as any; //TODO: fix types
        }
      } else {
        updated[person][number] = value;
      }

      return updated;
    });
  };

  useEffect(() => {
    if (isPractice) practiceProps?.onInput?.(inputs);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputs, isPractice, practiceProps?.onInput]);

  useEffect(() => {
    if (practiceProps?.showTranslation) setInputs(forms);
  }, [practiceProps?.showTranslation, forms]);

  const renderInput = (
    person: keyof VerbConjugations[Tenses.Past],
    quantity: Quantities,
    gender: Genders | undefined
  ) => {
    const inputGroupValue = inputs[person][quantity];
    const resultsGroupValue = practiceProps?.results?.[person]?.[quantity];

    const value =
      gender && typeof inputGroupValue === "object" && inputGroupValue !== null
        ? inputGroupValue[gender] ?? ""
        : typeof inputGroupValue === "string"
        ? inputGroupValue
        : "";

    const isCorrect =
      gender &&
      typeof resultsGroupValue === "object" &&
      resultsGroupValue !== null
        ? resultsGroupValue[gender] === true
        : typeof resultsGroupValue === "boolean"
        ? resultsGroupValue === true
        : false;

    const shouldShowFeedback =
      practiceProps?.verbFormsSubmitted && !practiceProps?.showTranslation;

    return (
      <TableCell colSpan={gender ? 1 : 2}>
        <VoiceoverWrapper
          shouldPlay={!!practiceProps?.showTranslation}
          value={value}
        >
          <VerbFormInput
            value={value}
            disabled={!!practiceProps?.showTranslation}
            onChange={(e) =>
              handleInputChange(
                person,
                quantity,
                gender ?? null,
                e.target.value
              )
            }
            isCorrect={!!isCorrect}
            shouldShowFeedback={!!shouldShowFeedback}
          />
        </VoiceoverWrapper>
      </TableCell>
    );
  };

  const renderTextCell = (
    person: keyof VerbConjugations[Tenses.Past],
    quantity: Quantities,
    gender?: Genders
  ) => {
    const groupValue = forms[person][quantity];
    const value =
      gender && typeof groupValue === "object" && groupValue !== null
        ? groupValue[gender]
        : typeof groupValue === "string"
        ? groupValue
        : "";

    return (
      <TableCellWithVoiceover colSpan={gender ? 1 : 2}>
        <CenteredText>
          <strong>{value}</strong>
        </CenteredText>
      </TableCellWithVoiceover>
    );
  };

  return (
    <TableContainer component={Paper} sx={{ margin: "auto", mt: 2 }}>
      <Typography variant="h6" align="center" sx={{ mt: 2 }}>
        Past Tense (עבר)
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
          {/* 1st Singular */}
          <TableRow>
            <TableCell>1st {isMobile ? "Sg." : "Singular"}</TableCell>
            {isPractice
              ? renderInput(1, Quantities.Singular, undefined)
              : renderTextCell(1, Quantities.Singular)}
          </TableRow>

          {/* 2nd Singular */}
          <TableRow>
            <TableCell>2nd {isMobile ? "Sg." : "Singular"}</TableCell>
            {isPractice
              ? renderInput(2, Quantities.Singular, Genders.Male)
              : renderTextCell(2, Quantities.Singular, Genders.Male)}
            {isPractice
              ? renderInput(2, Quantities.Singular, Genders.Female)
              : renderTextCell(2, Quantities.Singular, Genders.Female)}
          </TableRow>

          {/* 3rd Singular */}
          <TableRow>
            <TableCell>3rd {isMobile ? "Sg." : "Singular"}</TableCell>
            {isPractice
              ? renderInput(3, Quantities.Singular, Genders.Male)
              : renderTextCell(3, Quantities.Singular, Genders.Male)}
            {isPractice
              ? renderInput(3, Quantities.Singular, Genders.Female)
              : renderTextCell(3, Quantities.Singular, Genders.Female)}
          </TableRow>

          {/* 1st Plural */}
          <TableRow>
            <TableCell>1st {isMobile ? "Pl." : "Plural"}</TableCell>
            {isPractice
              ? renderInput(1, Quantities.Plural, undefined)
              : renderTextCell(1, Quantities.Plural)}
          </TableRow>

          {/* 2nd Plural */}
          <TableRow>
            <TableCell>2nd {isMobile ? "Pl." : "Plural"}</TableCell>
            {isPractice
              ? renderInput(2, Quantities.Plural, Genders.Male)
              : renderTextCell(2, Quantities.Plural, Genders.Male)}
            {isPractice
              ? renderInput(2, Quantities.Plural, Genders.Female)
              : renderTextCell(2, Quantities.Plural, Genders.Female)}
          </TableRow>

          {/* 3rd Plural */}
          <TableRow>
            <TableCell>3rd {isMobile ? "Pl." : "Plural"}</TableCell>
            {isPractice
              ? renderInput(3, Quantities.Plural, undefined)
              : renderTextCell(3, Quantities.Plural)}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
