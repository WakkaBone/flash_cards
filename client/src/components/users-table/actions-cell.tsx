import { Button, Tooltip } from "@mui/material";
import { DeleteForeverRounded, EditRounded } from "@mui/icons-material";
import { useCallback, useState } from "react";
import { UserModel } from "../../models/user";
import { useDeleteUsers } from "../../hooks";
import { useAuthContext } from "../../context/auth-context";
import { EditUserModal } from "../edit-user-modal/edit-user-modal";

export const ActionsCell = ({ user }: { user: UserModel }) => {
  const { user: authUser } = useAuthContext();
  const [isEdit, setIsEdit] = useState<boolean>(false);

  const {
    deleteUser,
    deleteUserRest: { isPending: isDeletePending },
  } = useDeleteUsers();

  const handleDeleteUser = useCallback(
    () => deleteUser(user.id),
    [deleteUser, user]
  );

  const canDelete = authUser?.id !== user.id;

  const onOpenEditModal = () => setIsEdit(true);
  const onCloseEditModal = () => setIsEdit(false);

  return (
    <>
      <Button
        size="small"
        disabled={!canDelete}
        onClick={handleDeleteUser}
        loading={isDeletePending}
      >
        <Tooltip title="Delete user">
          <DeleteForeverRounded />
        </Tooltip>
      </Button>
      <Button onClick={onOpenEditModal} size="small" title="Edit">
        <Tooltip title="Edit user">
          <EditRounded />
        </Tooltip>
      </Button>
      <EditUserModal
        open={isEdit}
        user={user}
        onClose={onCloseEditModal}
        onSuccess={onCloseEditModal}
      />
    </>
  );
};
