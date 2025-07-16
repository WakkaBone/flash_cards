import { useEffect, useRef } from "react";

export function useOnValueChange<T>(
  value: T,
  onChange: (prev: T | undefined, current: T) => void
) {
  const previous = useRef<T>();

  useEffect(() => {
    if (previous.current === value) return;
    onChange(previous.current, value);
    previous.current = value;
  }, [value, onChange]);
}
