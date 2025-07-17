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
import { useScreenSize } from "../../hooks";
import {
  CenteredText,
  GENDERS,
  TableCellWithVoiceover,
  VerbFormInput,
  VerbTenseTablePropsType,
  VoiceoverWrapper,
} from "./shared";
import { useEffect, useState } from "react";
import {
  Genders,
  Quantities,
  Tenses,
  VerbConjugations,
} from "../../models/verb";
import { DEFAULT_VERB_FORMS } from "../../hooks/cards/use-card-translation";

type FutureTenseTablePropsType = VerbTenseTablePropsType<Tenses.Future>;

export const FutureTenseTable = ({
  forms,
  isPractice = false,
  practiceProps,
}: FutureTenseTablePropsType) => {
  const { isMobile } = useScreenSize();
  const [inputs, setInputs] = useState<VerbConjugations[Tenses.Future]>(
    DEFAULT_VERB_FORMS.future
  );

  const handleInputChange = (
    person: keyof VerbConjugations[Tenses.Future],
    number: Quantities,
    gender: Genders | null,
    value: string
  ) => {
    setInputs((prev) => {
      const updated = structuredClone(prev);
      const currentVal = updated[person][number];

      if (gender) {
        if (typeof currentVal === "object" && currentVal !== null) {
          updated[person][number] = {
            ...currentVal,
            [gender]: value,
          };
        } else {
          updated[person][number] = { [gender]: value } as any; //TODO: fix type
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
    person: keyof VerbConjugations[Tenses.Future],
    quantity: Quantities,
    gender?: Genders
  ) => {
    const inputVal = inputs[person][quantity];
    const resultVal = practiceProps?.results?.[person]?.[quantity];

    const value =
      gender && typeof inputVal === "object"
        ? inputVal[gender] ?? ""
        : typeof inputVal === "string"
        ? inputVal
        : "";

    const isCorrect =
      gender && typeof resultVal === "object"
        ? resultVal[gender] === true
        : resultVal === true;

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
    person: keyof VerbConjugations[Tenses.Future],
    quantity: Quantities,
    gender?: Genders
  ) => {
    const valueData = forms[person][quantity];

    let value: string = "";
    if (gender) {
      if (
        typeof valueData === "object" &&
        valueData !== null &&
        Genders.Male in valueData &&
        Genders.Female in valueData
      ) {
        value = valueData[gender];
      }
    } else if (typeof valueData === "string") {
      value = valueData;
    }

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
        Future Tense (עתיד)
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
              ? renderInput(1, Quantities.Singular)
              : renderTextCell(1, Quantities.Singular)}
          </TableRow>

          {/* 2nd Singular */}
          <TableRow>
            <TableCell>2nd {isMobile ? "Sg." : "Singular"}</TableCell>
            {GENDERS.map((g) =>
              isPractice
                ? renderInput(2, Quantities.Singular, g)
                : renderTextCell(2, Quantities.Singular, g)
            )}
          </TableRow>

          {/* 3rd Singular */}
          <TableRow>
            <TableCell>3rd {isMobile ? "Sg." : "Singular"}</TableCell>
            {GENDERS.map((g) =>
              isPractice
                ? renderInput(3, Quantities.Singular, g)
                : renderTextCell(3, Quantities.Singular, g)
            )}
          </TableRow>

          {/* 1st Plural */}
          <TableRow>
            <TableCell>1st {isMobile ? "Pl." : "Plural"}</TableCell>
            {isPractice
              ? renderInput(1, Quantities.Plural)
              : renderTextCell(1, Quantities.Plural)}
          </TableRow>

          {/* 2nd Plural */}
          <TableRow>
            <TableCell>2nd {isMobile ? "Pl." : "Plural"}</TableCell>
            {GENDERS.map((g) =>
              isPractice
                ? renderInput(2, Quantities.Plural, g)
                : renderTextCell(2, Quantities.Plural, g)
            )}
          </TableRow>

          {/* 3rd Plural */}
          <TableRow>
            <TableCell>3rd {isMobile ? "Pl." : "Plural"}</TableCell>
            {GENDERS.map((g) =>
              isPractice
                ? renderInput(3, Quantities.Plural, g)
                : renderTextCell(3, Quantities.Plural, g)
            )}
          </TableRow>
        </TableBody>
      </Table>
    </TableContainer>
  );
};
