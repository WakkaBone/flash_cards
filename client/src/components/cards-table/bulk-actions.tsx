import { Button, Stack } from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useBulkActions, usePopoverConfirmation } from "../../hooks";
import { DeleteForeverRounded, TaskAltRounded } from "@mui/icons-material";
import { PopoverConfirmation } from "../popover-confirmation/popover-confirmation";
import { BulkActionsContainer } from "../bulk-actions/bulk-actions-container";

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

  const { confirmationProps, handleOpen, showConfirmation } =
    usePopoverConfirmation();

  return (
    <BulkActionsContainer numberOfItems={rowsSelected.length}>
      <Button
        loading={isLoading}
        disabled={isLoading}
        onClick={(e) =>
          handleOpen(
            e,
            handleBulkMarkLearned,
            "Are you sure you want to mark the selected cards as learned?"
          )
        }
        endIcon={<TaskAltRounded />}
      >
        Bulk Mark As Learned
      </Button>
      <Button
        color="error"
        loading={isLoading}
        disabled={isLoading}
        onClick={(e) =>
          handleOpen(
            e,
            handleBulkDelete,
            "Are you sure you want to delete the selected cards?"
          )
        }
        endIcon={<DeleteForeverRounded />}
      >
        Bulk Delete
      </Button>
      {confirmationProps && (
        <PopoverConfirmation {...confirmationProps} open={showConfirmation} />
      )}
    </BulkActionsContainer>
  );
};
