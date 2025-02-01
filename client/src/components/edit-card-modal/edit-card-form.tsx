import { Stack, TextField } from "@mui/material";
import { Categories } from "../../models/card";
import { Controller, UseFormReturn } from "react-hook-form";
import { CategorySelect } from "../category-select/category-select";
import { ToastContainer } from "react-toastify";

export type EditCardFormType = {
  category: Categories;
  english: string;
  hebrew: string;
};

type EditCardFormPropsType = {
  formProps: UseFormReturn<EditCardFormType>;
};
export const EditCardForm = ({ formProps }: EditCardFormPropsType) => {
  const {
    control,
    formState: { errors },
  } = formProps;

  return (
    <>
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
      </Stack>
      <ToastContainer />
    </>
  );
};
