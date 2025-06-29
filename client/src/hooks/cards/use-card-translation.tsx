import { useCallback, useEffect, useMemo, useState } from "react";
import { CardModel } from "../../models/card";
import { compareWithoutNiqqud } from "../../utils/string-util";

export const useCardTranslation = (
  card: CardModel | null | undefined,
  eth: boolean,
  hasOptions: boolean
) => {
  const [translation, setTranslation] = useState<string>("");
  const [showTranslation, setShowTranslation] = useState<boolean>(false);

  const resetTranslation = useCallback(() => {
    setShowTranslation(false);
    setTranslation("");
  }, []);

  useEffect(() => setTranslation(""), [showTranslation]);

  useEffect(() => resetTranslation(), [card?.id, resetTranslation]); //cleanup on card change

  const isCorrectTranslation = useMemo(() => {
    if (!card) return;
    const correctAnswer = eth ? card.hebrew : card.english;

    return compareWithoutNiqqud(
      translation.trim().toLowerCase(),
      correctAnswer.trim().toLowerCase()
    );
  }, [card, eth, translation]);

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
    showTranslation,
    setShowTranslation,
    handleSelectOption,
    isCorrectTranslation,
  };
};
