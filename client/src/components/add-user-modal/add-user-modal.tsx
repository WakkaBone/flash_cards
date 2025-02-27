import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useAddUser } from "../../hooks";
import { AddUserForm, AddUserFormType } from "./add-user-form";

type EditUserModalPropsType = {
  open: boolean;
  onClose: () => void;
  onSuccess?: (newUser: AddUserFormType) => void;
};
export const AddUserModal = ({
  open,
  onClose,
  onSuccess,
}: EditUserModalPropsType) => {
  const { addUser, isPending } = useAddUser();

  const formProps = useForm<AddUserFormType>();

  const onSave = async (formValues: AddUserFormType) => {
    addUser(formValues, {
      onSuccess: (data) => {
        if (!data.isSuccess) return;
        formProps.reset();
        onClose();
        onSuccess?.(formValues);
      },
      hideToast: true,
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add User</DialogTitle>
      <form onSubmit={formProps.handleSubmit(onSave)} style={{ width: "100%" }}>
        <DialogContent sx={{ minWidth: "40vw" }}>
          <AddUserForm formProps={formProps} />
        </DialogContent>
        <DialogActions>
          <Box>
            <Button onClick={onClose} color="primary">
              Cancel
            </Button>
            <Button
              loading={isPending}
              disabled={!formProps.formState.isDirty}
              type="submit"
              color="primary"
            >
              Save
            </Button>
          </Box>
        </DialogActions>
      </form>
    </Dialog>
  );
};
