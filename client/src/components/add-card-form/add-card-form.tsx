import { Button, Stack, TextField } from "@mui/material";
import { useForm, Controller } from "react-hook-form";
import { CategoryAutocomplete } from "../category-select/category-autocomplete";
import { useAddCard, useScreenSize } from "../../hooks";
import { ToastContainer } from "react-toastify";
import { englishValidator, hebrewValidator } from "../../utils/validators";
import { ConfirmationModal } from "../confirmation-modal/confirmation-modal";
import { useEffect } from "react";
import { IdLabel } from "../../models/shared";
import { mapAddCardFormToPayload } from "../../utils/mappers";
import { PrioritySelect } from "../priority-select/priority-select";
import { Priorities } from "../../models/card";

export type AddCardFormType = {
  category: IdLabel;
  english: string;
  hebrew: string;
  details?: string;
  priority: Priorities;
};

export const AddCardForm = () => {
  const {
    precheck,
    precheckRest: { isPending: isLoadingPrecheck },
    addRest: { isPending: isLoadingAdd, isSuccess },
    confirmationModalProps,
  } = useAddCard();
  const { isMobile } = useScreenSize();

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<AddCardFormType>({
    defaultValues: {
      english: "",
      hebrew: "",
      details: "",
      priority: Priorities.Medium,
    },
  });

  useEffect(() => {
    isSuccess && reset();
  }, [isSuccess, reset]);

  const onSubmit = (formData: AddCardFormType) =>
    precheck(mapAddCardFormToPayload(formData));

  const isLoading = isLoadingPrecheck || isLoadingAdd;

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
            <CategoryAutocomplete
              autocompleteProps={{
                value: field.value || null,
                onChange: (_, value) => value && field.onChange(value),
              }}
              error={errors.category?.message}
              allowAdd
            />
          )}
        />
        <Controller
          name="priority"
          rules={{ required: "Priority is required" }}
          control={control}
          render={({ field }) => (
            <PrioritySelect {...field} error={!!errors.priority} />
          )}
        />
        <Button
          disabled={isLoading}
          loading={isLoading}
          type="submit"
          variant="contained"
          fullWidth
        >
          Add
        </Button>
      </Stack>
      <ToastContainer />
      <ConfirmationModal {...confirmationModalProps} />
    </form>
  );
};
