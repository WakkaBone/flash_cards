import { useCallback, useEffect, useState } from "react";

const HEBREW_CODE = "he-IL";
const ENGLISH_CODE = "en-US";

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

  const ttsWithTranslation = useCallback(
    ({ hebrew, english }: { hebrew: string; english: string }) => {
      if (!supportsHebrew) return;

      const utteranceHebrew = new SpeechSynthesisUtterance(hebrew);
      utteranceHebrew.lang = HEBREW_CODE;
      utteranceHebrew.onstart = () => setIsUttering(true);
      utteranceHebrew.onend = () => {
        const utteranceEnglish = new SpeechSynthesisUtterance(english);
        utteranceEnglish.lang = ENGLISH_CODE;
        utteranceEnglish.onend = () => setIsUttering(false);
        speechSynthesis.speak(utteranceEnglish);
      };
      speechSynthesis.speak(utteranceHebrew);
    },
    [supportsHebrew]
  );

  return { supportsHebrew, tts, ttsWithTranslation, isUttering };
};

export { useTTS };
