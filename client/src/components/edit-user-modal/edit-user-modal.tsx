import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { UserModel } from "../../models/user";
import { useUpdateUser } from "../../hooks";
import { UserCards } from "./user-cards";
import { EditUserForm, EditUserFormType } from "./edit-user-form";
import { FORM_IDS } from "../../constants";
import { Modal } from "../modal/modal";

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

  const Actions = () => (
    <Box>
      <Button onClick={onClose} color="primary">
        Cancel
      </Button>
      <Button
        loading={isPending}
        disabled={!formProps.formState.isDirty}
        type="submit"
        color="primary"
        form={FORM_IDS.editUser}
      >
        Save
      </Button>
    </Box>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      actions={<Actions />}
      title="Edit User"
    >
      <form
        id={FORM_IDS.editUser}
        onSubmit={formProps.handleSubmit(onSave)}
        style={{ marginTop: "1rem" }}
      >
        <EditUserForm formProps={formProps} />
        <UserCards userId={user.id} />
      </form>
    </Modal>
  );
};
