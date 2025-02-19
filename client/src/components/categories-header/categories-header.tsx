import { Button, Stack, TextField } from "@mui/material";
import { useState } from "react";
import { useAddCategory } from "../../hooks/use-add-category";

export const CategoriesHeader = () => {
  const [isAddVisible, setIsAddVisible] = useState(false);
  const [name, setName] = useState("");

  const handleNameChange = (e: React.ChangeEvent<HTMLInputElement>) =>
    setName(e.target.value);

  const { addCategory, isPending } = useAddCategory();

  const handleAddCategory = () =>
    addCategory({ label: name }, { onSuccess: () => setIsAddVisible(false) });

  return (
    <Stack direction="row" gap={1} sx={{ mb: 1, height: "2.5em" }}>
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
          Add
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
    </Stack>
  );
};
