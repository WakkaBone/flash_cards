import { Box, Typography } from "@mui/material";
import { Tenses, VerbConjugations, VerbTenses } from "../../models/verb";
import { usePracticeContext } from "../../context/practice-context";
import { useCallback, useMemo } from "react";
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

  const sharedTensePracticeProps = useMemo(
    () => ({
      showTranslation,
      verbFormsSubmitted,
    }),
    [showTranslation, verbFormsSubmitted]
  );

  const onInputPresentTense = useCallback(
    (input: VerbConjugations[Tenses.Present]) => {
      handleInput(Tenses.Present, input);
    },
    [handleInput]
  );
  const presentTensePracticeProps = useMemo(
    () => ({
      ...sharedTensePracticeProps,
      onInput: onInputPresentTense,
      results: verbFormsResult?.present,
    }),
    [sharedTensePracticeProps, verbFormsResult?.present, onInputPresentTense]
  );

  const onInputPastTense = useCallback(
    (input: VerbConjugations[Tenses.Past]) => {
      handleInput(Tenses.Past, input);
    },
    [handleInput]
  );
  const pastTensePracticeProps = useMemo(
    () => ({
      ...sharedTensePracticeProps,
      onInput: onInputPastTense,
      results: verbFormsResult?.past,
    }),
    [sharedTensePracticeProps, verbFormsResult?.past, onInputPastTense]
  );

  const onInputFutureTense = useCallback(
    (input: VerbConjugations[Tenses.Future]) => {
      handleInput(Tenses.Future, input);
    },
    [handleInput]
  );
  const futureTensePracticeProps = useMemo(
    () => ({
      ...sharedTensePracticeProps,
      onInput: onInputFutureTense,
      results: verbFormsResult?.future,
    }),
    [sharedTensePracticeProps, verbFormsResult?.future, onInputFutureTense]
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
        practiceProps={presentTensePracticeProps}
      />
      <PastTenseTable
        forms={verbForms.past}
        isPractice
        practiceProps={pastTensePracticeProps}
      />
      <FutureTenseTable
        forms={verbForms.future}
        isPractice
        practiceProps={futureTensePracticeProps}
      />
      {inTransition && (
        <Box mt={2}>
          <IntervalCountdown seconds={interval} />
        </Box>
      )}
    </Box>
  );
};
