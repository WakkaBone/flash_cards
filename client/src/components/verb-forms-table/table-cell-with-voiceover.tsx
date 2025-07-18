import { TableCell, TableCellProps } from "@mui/material";
import { MouseEvent, PropsWithChildren, useCallback } from "react";
import { useTTS } from "../../hooks";

export const TableCellWithVoiceover = ({
  children,
  ...props
}: PropsWithChildren<TableCellProps>) => {
  const { tts, isUttering } = useTTS();

  const voiceCellContent = useCallback(
    (e: MouseEvent<HTMLTableCellElement>) => {
      const cellText = e.currentTarget.textContent;
      if (cellText && !isUttering) tts(cellText);
    },
    [tts, isUttering]
  );

  return (
    <TableCell {...props} onClick={voiceCellContent}>
      {children}
    </TableCell>
  );
};
