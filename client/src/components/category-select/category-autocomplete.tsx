import {
  FormControl,
  Autocomplete,
  TextField,
  AutocompleteProps,
  Button,
  Tooltip,
  TextFieldProps,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { useScreenSize } from "../../hooks";
import { useGetCategories } from "../../hooks/use-get-categories";
import { useAddCategory } from "../../hooks/use-add-category";
import { mapCategoryToSelectOption } from "../../utils/mappers";
import { IdLabel } from "../../models/shared";

export type CategoryOptionType = IdLabel;

type CategoryAutocompletePropsType = {
  autocompleteProps: Omit<
    AutocompleteProps<CategoryOptionType, false, false, false>,
    "renderInput" | "options" | "value"
  > & { value: CategoryOptionType | null };
  inputProps?: TextFieldProps;
  showAll?: boolean;
  allowAdd?: boolean;
  error?: string;
};
export const CategoryAutocomplete = ({
  autocompleteProps,
  inputProps,
  allowAdd,
  error,
}: CategoryAutocompletePropsType) => {
  const { isMobile } = useScreenSize();

  const [customInput, setCustomInput] = useState<string>("");

  const { data, isLoading, isFetching, refetch } = useGetCategories({});

  const { addCategory, isPending: isAddingCategory } = useAddCategory();

  const handleAddNewCategory = () => {
    if (!customInput.trim()) return;
    const newCategoryPayload = { label: customInput.trim() };
    addCategory(newCategoryPayload, {
      onSuccess: () => {
        refetch();
      },
    });
  };

  useEffect(() => {
    return () => {
      setCustomInput("");
    };
  }, []);

  const [options, setOptions] = useState<CategoryOptionType[]>([]);

  useEffect(() => {
    if (!data.data) return;
    setOptions(
      data.data.map((category) => mapCategoryToSelectOption(category))
    );
  }, [data]);

  const isNewCategory = !options.some(
    (option) => option.label.toLowerCase() === customInput.toLowerCase()
  );

  const [value, setValue] = useState<CategoryOptionType | null>(
    autocompleteProps.value
  );
  useEffect(() => {
    setValue(autocompleteProps?.value || null);
    setCustomInput(autocompleteProps?.value?.label || "");
  }, [autocompleteProps]);

  return (
    <FormControl fullWidth>
      <Autocomplete<CategoryOptionType>
        {...autocompleteProps}
        inputValue={customInput}
        loading={isLoading || isFetching}
        clearIcon={null}
        options={options}
        clearOnBlur
        popupIcon={null}
        value={value}
        isOptionEqualToValue={(option, newValue) =>
          (option as CategoryOptionType).id ===
          (newValue as CategoryOptionType).id
        }
        onChange={(e, value, reason, details) => {
          if (!value) return;
          setValue(value);
          setCustomInput(value.label);
          autocompleteProps.onChange?.(e, value, reason, details);
        }}
        getOptionLabel={(option) => (option as CategoryOptionType).label}
        renderInput={(params) => (
          <TextField
            {...params}
            margin="none"
            sx={{
              "& .MuiInputBase-input": {
                pr: "0px !important",
              },
            }}
            label="Select a category"
            value={customInput}
            onChange={(e) => setCustomInput(e.target.value)}
            {...inputProps}
            error={!!error}
            helperText={error}
          />
        )}
      />
      {allowAdd && isNewCategory && customInput && (
        <Button
          disabled={isAddingCategory}
          sx={{
            position: "absolute",
            background: "transparent",
            height: "50%",
            top: "25%",
            right: 0,
            p: "0px 6px",
            minWidth: 0,
          }}
        >
          <Tooltip title="Add new category">
            <AddCircleOutline
              onClick={handleAddNewCategory}
              sx={{ p: 0, m: 0 }}
              fontSize={isMobile ? "small" : "medium"}
            />
          </Tooltip>
        </Button>
      )}
    </FormControl>
  );
};
