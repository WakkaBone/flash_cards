import { Button } from "@mui/material";
import { GridRowSelectionModel } from "@mui/x-data-grid";
import { useDeleteUsers, usePopoverConfirmation } from "../../hooks";
import { DeleteForeverRounded } from "@mui/icons-material";
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
  const {
    bulkDeleteUsers,
    bulkDeleteUsersRest: { isPending: isLoading },
  } = useDeleteUsers();

  const clearRowSelection = () => setRowsSelected([]);

  const handleBulkDelete = () =>
    bulkDeleteUsers(rowsSelected as string[], {
      onSuccess: () => clearRowSelection(),
    });

  const { confirmationProps, handleOpen, showConfirmation } =
    usePopoverConfirmation();

  return (
    <BulkActionsContainer numberOfItems={rowsSelected.length}>
      <Button
        color="error"
        loading={isLoading}
        disabled={isLoading}
        onClick={(e) =>
          handleOpen(
            e,
            handleBulkDelete,
            "Are you sure you want to delete the selected users?"
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
