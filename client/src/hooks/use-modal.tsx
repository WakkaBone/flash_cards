import { useCallback, useState } from "react";

export const useModal = (props?: {
  onClose?: () => void;
  onOpen?: () => void;
  defaultOpen?: boolean;
}) => {
  const [open, setOpen] = useState(props?.defaultOpen ?? false);

  const onOpen = useCallback(() => {
    setOpen(true);
    props?.onOpen?.();
  }, [props]);

  const onClose = useCallback(() => {
    setOpen(false);
    props?.onClose?.();
  }, [props]);

  return { open, onOpen, onClose };
};
