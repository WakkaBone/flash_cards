import { Stack, TextField } from "@mui/material";
import { Controller, UseFormReturn } from "react-hook-form";
import { EditCardFormType } from "./edit-card-form";
import { CollapsibleSection } from "../collapsible/collapsible-section";
import { TrendingUp } from "@mui/icons-material";

type EditCardReadonlyDataPropsType = {
  formProps: UseFormReturn<EditCardFormType>;
};
export const EditCardReadonlyData = ({
  formProps,
}: EditCardReadonlyDataPropsType) => {
  const {
    control,
    formState: { errors },
  } = formProps;

  return (
    <Stack mb={2}>
      <CollapsibleSection
        buttonText="Card Statistics"
        buttonProps={{ startIcon: <TrendingUp /> }}
      >
        <Stack spacing={2} mt={2} mb={2} direction={"row"} alignItems={"start"}>
          <Controller
            name="createdAt"
            disabled
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Added at"
                placeholder="Added at"
                error={!!errors.createdAt}
                helperText={errors.createdAt?.message}
              />
            )}
          />
          <Controller
            name="lastPractice"
            disabled
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Last practice"
                placeholder="Last practice"
                error={!!errors.lastPractice}
                helperText={errors.lastPractice?.message}
              />
            )}
          />
        </Stack>
        <Stack spacing={2} direction={"row"} alignItems={"start"}>
          <Controller
            name="correctAnswers"
            disabled
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Correct answers"
                placeholder="Correct answers"
                error={!!errors.correctAnswers}
                helperText={errors.correctAnswers?.message}
              />
            )}
          />
          <Controller
            name="wrongAnswers"
            disabled
            control={control}
            render={({ field }) => (
              <TextField
                {...field}
                fullWidth
                label="Wrong answers"
                placeholder="Wrong answers"
                error={!!errors.correctAnswers}
                helperText={errors.correctAnswers?.message}
              />
            )}
          />
        </Stack>
      </CollapsibleSection>
    </Stack>
  );
};
