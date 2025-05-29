import { useCallback, useEffect, useState } from "react";

const HEBREW_CODE = "he-IL";

const useTTS = () => {
  const [isUttering, setIsUttering] = useState(false);
  const [supportsHebrew, setSupportsHebrew] = useState(false);

  const availableVoices = speechSynthesis.getVoices();

  useEffect(() => {
    setSupportsHebrew(availableVoices.some(({ lang }) => lang === HEBREW_CODE));
  }, [availableVoices]);

  const tts = useCallback(
    (string: string) => {
      if (!supportsHebrew) return;

      const utterance = new SpeechSynthesisUtterance(string);
      utterance.lang = HEBREW_CODE;
      utterance.onstart = () => setIsUttering(true);
      utterance.onend = () => setIsUttering(false);
      utterance.rate = 0.5;
      speechSynthesis.speak(utterance);
    },
    [supportsHebrew]
  );

  return { supportsHebrew, tts, isUttering };
};

export { useTTS };
