import { IconButton, Tooltip } from "@mui/material";
import { Cancel, EditNote, SaveAs } from "@mui/icons-material";

type MyAccountCardActionsPropsType = {
  isEdit: boolean;
  setIsEdit: (val: boolean) => void;
  onSave: () => void;
  allowSave: boolean;
  isLoading: boolean;
};
export const MyAccountCardActions = ({
  isEdit,
  allowSave,
  onSave,
  setIsEdit,
  isLoading,
}: MyAccountCardActionsPropsType) => (
  <>
    <IconButton
      sx={{ visibility: isEdit ? "visible" : "hidden" }}
      disabled={(isEdit && !allowSave) || isLoading}
      color="primary"
    >
      <Tooltip title="Save">
        <SaveAs onClick={() => onSave()} />
      </Tooltip>
    </IconButton>
    {isEdit ? (
      <IconButton color="primary" disabled={isLoading}>
        <Tooltip title="Cancel Edit">
          <Cancel onClick={() => setIsEdit(false)} />
        </Tooltip>
      </IconButton>
    ) : (
      <IconButton color="primary" disabled={isLoading}>
        <Tooltip title="Edit">
          <EditNote onClick={() => setIsEdit(true)} />
        </Tooltip>
      </IconButton>
    )}
  </>
);
