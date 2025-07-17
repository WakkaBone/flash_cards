import { useCallback, useEffect, useMemo, useState } from "react";
import { CardModel } from "../../models/card";
import { compareWithoutNiqqud } from "../../utils/string-util";
import {
  Genders,
  Quantities,
  Tenses,
  VerbConjugations,
  VerbTenses,
} from "../../models/verb";
import { Booleanified } from "../../models/shared";

export const DEFAULT_VERB_FORMS = {
  [Tenses.Present]: {
    [Quantities.Plural]: { [Genders.Male]: "", [Genders.Female]: "" },
    [Quantities.Singular]: { [Genders.Male]: "", [Genders.Female]: "" },
  },
  [Tenses.Past]: {
    "1": { [Quantities.Plural]: "", [Quantities.Singular]: "" },
    "2": {
      [Quantities.Plural]: { [Genders.Male]: "", [Genders.Female]: "" },
      [Quantities.Singular]: { [Genders.Male]: "", [Genders.Female]: "" },
    },
    "3": {
      [Quantities.Plural]: "",
      [Quantities.Singular]: { [Genders.Male]: "", [Genders.Female]: "" },
    },
  },
  [Tenses.Future]: {
    "1": { [Quantities.Plural]: "", [Quantities.Singular]: "" },
    "2": {
      [Quantities.Plural]: { [Genders.Female]: "", [Genders.Male]: "" },
      [Quantities.Singular]: { [Genders.Female]: "", [Genders.Male]: "" },
    },
    "3": {
      [Quantities.Plural]: { [Genders.Female]: "", [Genders.Male]: "" },
      [Quantities.Singular]: { [Genders.Female]: "", [Genders.Male]: "" },
    },
  },
};

export function compareVerbForms(input: any, expected: any) {
  const result = {} as any;

  for (const key of Object.keys(expected) as (keyof typeof expected)[]) {
    const inputVal = input[key];
    const expectedVal = expected[key];

    if (typeof expectedVal === "string") {
      const hasSeveralOptions = expectedVal.includes("/");

      let comparisonResult: boolean;

      if (hasSeveralOptions) {
        const options = expectedVal.split("/").map((opt) => opt.trim());
        comparisonResult = options.some((option) =>
          compareWithoutNiqqud(inputVal, option)
        );
      } else {
        comparisonResult = compareWithoutNiqqud(inputVal, expectedVal);
      }

      result[key] = comparisonResult;
    } else if (
      typeof expectedVal === "object" &&
      expectedVal !== null &&
      typeof inputVal === "object"
    ) {
      result[key] = compareVerbForms(
        inputVal as any,
        expectedVal as any
      ) as any;
    }
  }

  return result;
}

function areAllValuesTrue(obj: unknown): boolean {
  if (typeof obj === "boolean") return obj === true;
  if (typeof obj === "object" && obj !== null)
    return Object.values(obj).every((value) => areAllValuesTrue(value));
  return false;
}

export type BooleanifiedVerbConjugations = Booleanified<VerbTenses>;

export const useCardTranslation = (
  card: CardModel | null | undefined,
  eth: boolean,
  hasOptions: boolean,
  verbForms?: VerbConjugations
) => {
  const [translation, setTranslation] = useState<string>("");
  const [showTranslation, setShowTranslation] = useState<boolean>(false);

  const [inputtedVerbForms, setInputtedVerbForms] =
    useState<VerbTenses>(DEFAULT_VERB_FORMS);
  const [verbFormsResult, setVerbFormsResult] =
    useState<BooleanifiedVerbConjugations | null>(null);
  const [verbFormsSubmitted, setVerbFormsSubmitted] = useState(false);

  const resetTranslation = useCallback(() => {
    setShowTranslation(false);
    setTranslation("");
    setInputtedVerbForms(DEFAULT_VERB_FORMS);
    setVerbFormsSubmitted(false);
  }, []);

  useEffect(() => setTranslation(""), [showTranslation]);

  useEffect(() => resetTranslation(), [card?.id, resetTranslation]); //cleanup on card change

  const isCorrectTranslation = useMemo(() => {
    if (!card) return;
    if (!!verbForms) {
      const { infinitive, ...expectedForms } = verbForms;
      const result = compareVerbForms(inputtedVerbForms, expectedForms);
      setVerbFormsResult(result);

      return areAllValuesTrue(result);
    }

    const correctAnswer = eth ? card.hebrew : card.english;

    return compareWithoutNiqqud(
      translation.trim().toLowerCase(),
      correctAnswer.trim().toLowerCase()
    );
  }, [card, eth, translation, verbForms, inputtedVerbForms]);

  const handleSelectOption = useCallback(
    (option: string) => {
      if (!hasOptions) return;
      document.activeElement instanceof HTMLElement &&
        document.activeElement.blur();

      setTranslation(option);
    },
    [hasOptions, setTranslation]
  );

  return {
    translation,
    setTranslation,
    inputtedVerbForms,
    setInputtedVerbForms,
    verbFormsResult,
    verbFormsSubmitted,
    setVerbFormsSubmitted,
    showTranslation,
    setShowTranslation,
    handleSelectOption,
    isCorrectTranslation,
  };
};
