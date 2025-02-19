import { Stack, TextField } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";

export type EditCategoryFormType = {
  label: string;
};

type EditCardFormPropsType = {
  formProps: UseFormReturn<EditCategoryFormType>;
};
export const EditCategoryForm = ({ formProps }: EditCardFormPropsType) => {
  const {
    control,
    formState: { errors },
  } = formProps;

  return (
    <Stack spacing={2} mb={2} direction={"row"} alignItems={"start"}>
      <Controller
        name="label"
        rules={{
          required: "Category name is required",
        }}
        control={control}
        render={({ field }) => (
          <TextField
            {...field}
            fullWidth
            required
            label="Category name"
            placeholder="Category name"
            error={!!errors.label}
            helperText={errors.label?.message}
          />
        )}
      />
    </Stack>
  );
};
