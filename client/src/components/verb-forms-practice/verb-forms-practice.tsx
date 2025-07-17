import { Box, Typography } from "@mui/material";
import { Tenses, VerbConjugations, VerbTenses } from "../../models/verb";
import { usePracticeContext } from "../../context/practice-context";
import { useCallback } from "react";
import { PresentTenseTable } from "../verb-conjugations-tables/present-tense-table";
import { PastTenseTable } from "../verb-conjugations-tables/past-tense-table";
import { FutureTenseTable } from "../verb-conjugations-tables/future-tense-table";
import { CardModel } from "../../models/card";
import { IntervalCountdown } from "../card/card-footer";

type VerbFormsPracticePropsType = {
  card: CardModel | null | undefined;
  verbForms?: VerbConjugations;
};
export const VerbFormsPractice = ({
  verbForms,
  card,
}: VerbFormsPracticePropsType) => {
  const {
    settings: { interval },
    loadersState: { inTransition },
    translationState: {
      inputtedVerbForms,
      setInputtedVerbForms,
      verbFormsResult,
      showTranslation,
      verbFormsSubmitted,
    },
  } = usePracticeContext();

  const handleInput = useCallback(
    <T extends VerbConjugations[keyof VerbConjugations]>(
      tense: keyof VerbTenses,
      input: T
    ) => {
      setInputtedVerbForms((prev) => ({ ...prev, [tense]: input }));
    },
    [setInputtedVerbForms]
  );

  const getPracticeProps = useCallback(
    <T extends keyof VerbTenses>(tense: T) => ({
      input: inputtedVerbForms[tense],
      onInput: (input: VerbConjugations[T]) => handleInput(tense, input),
      results: verbFormsResult?.[tense],
      showTranslation,
      verbFormsSubmitted,
    }),
    [
      handleInput,
      inputtedVerbForms,
      verbFormsResult,
      showTranslation,
      verbFormsSubmitted,
    ]
  );

  if (!verbForms)
    return (
      <Typography>
        No verb forms were found for this card, please try next
      </Typography>
    );

  return (
    <Box>
      <Typography align="center" typography={"h4"}>
        {verbForms.infinitive} - {card?.english}
      </Typography>
      <PresentTenseTable
        forms={verbForms.present}
        isPractice
        practiceProps={getPracticeProps(Tenses.Present)}
      />
      <PastTenseTable
        forms={verbForms.past}
        isPractice
        practiceProps={getPracticeProps(Tenses.Past)}
      />
      <FutureTenseTable
        forms={verbForms.future}
        isPractice
        practiceProps={getPracticeProps(Tenses.Future)}
      />
      {inTransition && (
        <Box mt={2}>
          <IntervalCountdown seconds={interval} />
        </Box>
      )}
    </Box>
  );
};
