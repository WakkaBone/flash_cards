import { Button } from "@mui/material";
import { useState } from "react";
import { AddUserModal } from "../add-user-modal/add-user-modal";
import { TableHeader } from "../table-header/table-header";

export const UsersHeader = () => {
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <TableHeader>
      <Button variant="contained" onClick={handleOpenModal}>
        Add User
      </Button>
      <AddUserModal
        open={showModal}
        onClose={handleCloseModal}
        onSuccess={handleCloseModal}
      />
    </TableHeader>
  );
};
