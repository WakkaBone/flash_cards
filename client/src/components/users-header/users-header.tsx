import { Button, Stack } from "@mui/material";
import { useState } from "react";
import { AddUserModal } from "../add-user-modal/add-user-modal";

export const UsersHeader = () => {
  const [showModal, setShowModal] = useState(false);
  const handleOpenModal = () => setShowModal(true);
  const handleCloseModal = () => setShowModal(false);

  return (
    <Stack
      direction="row"
      gap={1}
      sx={{ mb: 1, height: "2.5em", justifyContent: "flex-end" }}
    >
      <Button variant="contained" onClick={handleOpenModal}>
        Add User
      </Button>
      <AddUserModal
        open={showModal}
        onClose={handleCloseModal}
        onSuccess={handleCloseModal}
      />
    </Stack>
  );
};
