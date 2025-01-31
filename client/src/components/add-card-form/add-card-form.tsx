import { Button, Stack, TextField } from "@mui/material";
import { Categories } from "../../models/card";
import { useForm, Controller } from "react-hook-form";
import { CategorySelect } from "../category-select/category-select";
import { useAddCard } from "../../hooks/use-add-card";
import { ToastContainer, toast } from "react-toastify";

type AddCardFormType = {
  category: Categories;
  english: string;
  hebrew: string;
};

export const AddCardForm = () => {
  const { mutate: addCard, isPending } = useAddCard();

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
      onSuccess: () => {
        toast("Card added successfully", { type: "success" });
        reset();
      },
      onError: () => toast("Something went wrong", { type: "error" }),
    });
  };

  return (
    <>
      <form onSubmit={handleSubmit(onSubmit)} style={{ width: "100%" }}>
        <Stack spacing={2} mb={2} direction={"row"} alignItems={"start"}>
          <Controller
            name="english"
            rules={{ required: "English translation is required" }}
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                placeholder="English"
                error={!!errors.category}
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
                error={!!errors.category}
                helperText={errors.english?.message}
              />
            )}
          />
        </Stack>
        <Stack spacing={2} direction={"row"} alignItems={"center"}>
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
    </>
  );
};
