import { Stack, TextField } from "@mui/material";
import { Categories } from "../../models/card";
import { Controller, UseFormReturn } from "react-hook-form";
import { CategorySelect } from "../category-select/category-select";
import { ToastContainer } from "react-toastify";
import { englishValidator, hebrewValidator } from "../../utils/validators";

export type EditCardFormType = {
  category: Categories;
  english: string;
  hebrew: string;
  details?: string;
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
          rules={{
            required: "English translation is required",
            validate: englishValidator,
          }}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              required
              label="English"
              placeholder="English"
              error={!!errors.english}
              helperText={errors.english?.message}
            />
          )}
        />
        <Controller
          name="hebrew"
          rules={{
            required: "Hebrew translation is required",
            validate: hebrewValidator,
          }}
          control={control}
          render={({ field }) => (
            <TextField
              {...field}
              fullWidth
              required
              label="Hebrew"
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
              placeholder="Examples or details"
              multiline
              rows={2}
              variant="outlined"
              fullWidth
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
