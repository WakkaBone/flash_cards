import { Button, Tooltip } from "@mui/material";
import { DeleteForeverRounded, EditRounded } from "@mui/icons-material";
import { useCallback } from "react";
import { UserModel } from "../../models/user";
import { useDeleteUsers, useModal } from "../../hooks";
import { useAuthContext } from "../../context/auth-context";
import { EditUserModal } from "../edit-user-modal/edit-user-modal";

export const ActionsCell = ({ user }: { user: UserModel }) => {
  const { user: authUser } = useAuthContext();

  const editModal = useModal();

  const {
    deleteUser,
    deleteUserRest: { isPending: isDeletePending },
  } = useDeleteUsers();

  const handleDeleteUser = useCallback(
    () => deleteUser(user.id),
    [deleteUser, user]
  );

  const canDelete = authUser?.id !== user.id;

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
      <Button onClick={editModal.onOpen} size="small" title="Edit">
        <Tooltip title="Edit user">
          <EditRounded />
        </Tooltip>
      </Button>
      <EditUserModal {...editModal} user={user} onSuccess={editModal.onClose} />
    </>
  );
};
