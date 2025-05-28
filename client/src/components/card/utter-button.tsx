import { VolumeUp } from "@mui/icons-material";
import { useTTS } from "../../hooks";
import { useCallback } from "react";

export const UtterButton = ({ text }: { text: string }) => {
  const { supportsHebrew, tts, isUttering } = useTTS();

  const playTTS = useCallback(() => text && tts(text), [text, tts]);

  return supportsHebrew ? (
    <VolumeUp
      onClick={playTTS}
      sx={{
        cursor: "pointer",
        verticalAlign: "middle",
        opacity: !isUttering ? 1 : 0.5,
        pointerEvents: !isUttering ? "auto" : "none",
      }}
      fontSize="small"
    />
  ) : (
    <></>
  );
};
