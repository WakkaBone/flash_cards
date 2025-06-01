import { useCallback, useEffect, useState } from "react";

const HEBREW_CODE = "he-IL";
const ENGLISH_CODE = "en-US";

const getUtterance = (config: Partial<SpeechSynthesisUtterance>) => {
  const utterance = new SpeechSynthesisUtterance(config.text);
  Object.assign(utterance, config);
  return utterance;
};

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

      const utterance = getUtterance({
        text: string,
        lang: HEBREW_CODE,
        rate: 0.5,
        onstart: () => setIsUttering(true),
        onend: () => setIsUttering(false),
      });
      speechSynthesis.speak(utterance);
    },
    [supportsHebrew]
  );

  const ttsWithTranslation = useCallback(
    ({ hebrew, english }: { hebrew: string; english: string }) => {
      if (!supportsHebrew) return;
      const rate = 0.7;

      const utteranceHebrew = getUtterance({
        text: hebrew,
        lang: HEBREW_CODE,
        rate,
        onstart: () => setIsUttering(true),
        onend: () => {
          const utteranceEnglish = getUtterance({
            text: english,
            lang: ENGLISH_CODE,
            rate,
            onend: () => setIsUttering(false),
          });

          speechSynthesis.speak(utteranceEnglish);
        },
      });

      speechSynthesis.speak(utteranceHebrew);
    },
    [supportsHebrew]
  );

  return { supportsHebrew, tts, ttsWithTranslation, isUttering };
};

export { useTTS };
