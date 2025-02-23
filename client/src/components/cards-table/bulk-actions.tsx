import { Box, Button, Stack } from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useBulkActions } from "../../hooks";
import { DeleteForeverRounded, TaskAltRounded } from "@mui/icons-material";

type BulkActionsPropsType = {
  rowsSelected: GridRowSelectionModel;
  setRowsSelected: React.Dispatch<React.SetStateAction<GridRowSelectionModel>>;
};
export const BulkActions = ({
  rowsSelected,
  setRowsSelected,
}: BulkActionsPropsType) => {
  const { bulkDelete, bulkMarkLearned, isLoading } = useBulkActions();

  const clearRowSelection = () => setRowsSelected([]);

  const handleBulkDelete = () =>
    bulkDelete(rowsSelected as string[], {
      onSuccess: () => clearRowSelection(),
    });
  const handleBulkMarkLearned = () =>
    bulkMarkLearned(rowsSelected as string[], {
      onSuccess: () => clearRowSelection(),
    });

  return (
    <Stack
      direction={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      sx={{ m: "15px 10px 5px 10px" }}
    >
      <Box>{rowsSelected.length} items selected</Box>
      <Stack direction={"row"} spacing={2}>
        <Button
          loading={isLoading}
          disabled={isLoading}
          onClick={handleBulkMarkLearned}
          endIcon={<TaskAltRounded />}
        >
          Bulk Mark As Learned
        </Button>
        <Button
          loading={isLoading}
          disabled={isLoading}
          onClick={handleBulkDelete}
          endIcon={<DeleteForeverRounded />}
        >
          Bulk Delete
        </Button>
      </Stack>
    </Stack>
  );
};
