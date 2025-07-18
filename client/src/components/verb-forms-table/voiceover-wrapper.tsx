import { PropsWithChildren, useCallback } from "react";
import { useTTS } from "../../hooks";

type VoiceoverWrapperPropsType = {
  shouldPlay: boolean;
  value: string;
};
export const VoiceoverWrapper = ({
  shouldPlay,
  value,
  children,
}: PropsWithChildren<VoiceoverWrapperPropsType>) => {
  const { tts, isUttering } = useTTS();

  const voiceOver = useCallback(
    () => shouldPlay && !isUttering && tts(value), //TODO: fix no sound on mobile
    [shouldPlay, isUttering, tts, value]
  );

  return <div onClick={voiceOver}>{children}</div>;
};
