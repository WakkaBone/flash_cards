import { useCallback, useMemo } from "react";

const useTTS = () => {
  const supportsHebrew = useMemo(() => {
    const supportedVoices = speechSynthesis.getVoices();
    return supportedVoices.some(({ lang }) => lang === "he-IL");
  }, []);

  const tts = useCallback(
    (string: string) => {
      if (!supportsHebrew) return;
      const utterance = new SpeechSynthesisUtterance(string);
      utterance.lang = "he-IL";
      speechSynthesis.speak(utterance);
    },
    [supportsHebrew]
  );

  return { supportsHebrew, tts };
};

export { useTTS };
