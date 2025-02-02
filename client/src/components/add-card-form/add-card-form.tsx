import { Button, Stack, TextField } from "@mui/material";
import { Categories } from "../../models/card";
import { useForm, Controller } from "react-hook-form";
import { CategorySelect } from "../category-select/category-select";
import { useAddCard, useScreenSize } from "../../hooks";
import { ToastContainer } from "react-toastify";

type AddCardFormType = {
  category: Categories;
  english: string;
  hebrew: string;
  details?: string;
};

export const AddCardForm = () => {
  const { addCard, isPending } = useAddCard();
  const { isMobile } = useScreenSize();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCardFormType>({
    defaultValues: { category: Categories.Noun, english: "", hebrew: "" },
  });

  const onSubmit = (data: AddCardFormType) => {
    addCard(data, {
      onSuccess: () => reset(),
    });
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
      <Stack
        spacing={2}
        mb={2}
        direction={isMobile ? "column" : "row"}
        alignItems={"start"}
      >
        <Controller
          name="english"
          rules={{ required: "English translation is required" }}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="English"
              error={!!errors.english}
              helperText={errors.english?.message}
            />
          )}
        />
        <Controller
          name="hebrew"
          rules={{ required: "Hebrew translation is required" }}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              placeholder="Hebrew"
              error={!!errors.hebrew}
              helperText={errors.hebrew?.message}
            />
          )}
        />
      </Stack>
      <Stack mb={2}>
        <Controller
          name="details"
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              label="Examples or details"
              multiline
              rows={2}
              variant="outlined"
              fullWidth
            />
          )}
        />
      </Stack>
      <Stack
        spacing={2}
        direction={isMobile ? "column" : "row"}
        alignItems={"center"}
      >
        <Controller
          name="category"
          rules={{ required: "Category is required" }}
          control={control}
          render={({ field }) => (
            <CategorySelect {...field} fullWidth error={!!errors.category} />
          )}
        />
        <Button
          disabled={isPending}
          type="submit"
          variant="contained"
          fullWidth
        >
          Add
        </Button>
      </Stack>
      <ToastContainer />
    </form>
  );
};
