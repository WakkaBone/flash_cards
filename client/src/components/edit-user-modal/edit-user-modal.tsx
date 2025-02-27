import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { UserModel } from "../../models/user";
import { useUpdateUser } from "../../hooks";
import { UserCards } from "./user-cards";
import { EditUserForm, EditUserFormType } from "./edit-user-form";

type EditUserModalPropsType = {
  open: boolean;
  user: UserModel;
  onClose: () => void;
  onSuccess?: (updatedData: UserModel) => void;
};
export const EditUserModal = ({
  open,
  user,
  onClose,
  onSuccess,
}: EditUserModalPropsType) => {
  const { updateUser, isPending } = useUpdateUser();

  const formProps = useForm<EditUserFormType>({
    defaultValues: { username: user.username, role: user.role },
  });

  const onSave = async (formValues: EditUserFormType) => {
    const payload = { ...user, ...formValues };
    updateUser(payload, {
      onSuccess: (data) => {
        if (!data.isSuccess) return;
        formProps.reset(formValues);
        onClose();
        onSuccess?.(payload);
      },
      hideToast: true,
    });
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Edit User</DialogTitle>
      <form onSubmit={formProps.handleSubmit(onSave)} style={{ width: "100%" }}>
        <DialogContent>
          <EditUserForm formProps={formProps} />
          <UserCards userId={user.id} />
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
