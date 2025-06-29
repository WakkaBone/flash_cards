import { Box, Button } from "@mui/material";
import { useForm } from "react-hook-form";
import { useAddUser } from "../../hooks";
import { AddUserForm, AddUserFormType } from "./add-user-form";
import { Modal } from "../modal/modal";
import { FORM_IDS } from "../../constants";

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
        form={FORM_IDS.addUser}
      >
        Save
      </Button>
    </Box>
  );

  return (
    <Modal
      open={open}
      onClose={onClose}
      title="Add User"
      contentProps={{
        sx: {
          minWidth: "40vw",
        },
      }}
      actions={<Actions />}
    >
      <form
        id={FORM_IDS.addUser}
        onSubmit={formProps.handleSubmit(onSave)}
        style={{ width: "100%", marginTop: "1rem" }}
      >
        <AddUserForm formProps={formProps} />
      </form>
    </Modal>
  );
};
