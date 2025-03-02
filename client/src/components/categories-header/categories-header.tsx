import { Button, TextField } from "@mui/material";
import { useState } from "react";
import { useAddCategory } from "../../hooks";
import { TableHeader } from "../table-header/table-header";

export const CategoriesHeader = () => {
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [name, setName] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const { addCategory, isPending } = useAddCategory();

  const handleAddCategory = () =>
    addCategory({ label: name }, { onSuccess: () => setIsAddVisible(false) });

  return (
    <TableHeader>
      {isAddVisible ? (
        <Button
          loading={isPending}
          variant="contained"
          onClick={() => setIsAddVisible(false)}
        >
          Hide
        </Button>
      ) : (
        <Button
          loading={isPending}
          variant="contained"
          onClick={() => setIsAddVisible(true)}
        >
          Add Category
        </Button>
      )}
      {isAddVisible && (
        <>
          <TextField
            label="Name"
            size="small"
            placeholder="Name"
            onChange={handleNameChange}
          />
          <Button
            loading={isPending}
            variant="contained"
            onClick={handleAddCategory}
          >
            Save
          </Button>
        </>
      )}
    </TableHeader>
  );
};
