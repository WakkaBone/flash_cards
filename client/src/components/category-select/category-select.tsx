import {
  FormControl,
  Autocomplete,
  TextField,
  AutocompleteProps,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
  Button,
  Tooltip,
} from "@mui/material";
import { useEffect, useState } from "react";
import { AddCircleOutline } from "@mui/icons-material";
import { useScreenSize } from "../../hooks";
import { useGetCategories } from "../../hooks/use-get-categories";
import { useAddCategory } from "../../hooks/use-add-category";

export type CategoryOptionType = { key: string; label: string };

export const CategorySelect = (props: SelectProps & { showAll?: boolean }) => {
  const [categories, setCategories] = useState<CategoryOptionType[]>([]);

  const { data } = useGetCategories({});
  useEffect(() => {
    if (!data.data) return;
    setCategories(data.data.map(({ id, label }) => ({ key: id, label })));
  }, [data]);

  return (
    <FormControl fullWidth>
      <InputLabel id="category-select-label">Categories</InputLabel>
      <Select labelId="category-select-label" id="category-select" {...props}>
        {!!props.showAll && <MenuItem value={0}>All</MenuItem>}
        {categories.map((category) => (
          <MenuItem key={category.key} value={category.key}>
            {category.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};

type CategoryAutocompletePropsType = {
  autocompleteProps: Omit<
    AutocompleteProps<CategoryOptionType | string, false, true, true>,
    "renderInput" | "options"
  >;
  showAll?: boolean;
  allowAdd?: boolean;
  selected?: string;
};
export const CategoryAutocomplete = ({
  autocompleteProps,
  allowAdd,
  selected,
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

  const options =
    data?.data?.map(({ id, label }) => ({ key: id, label })) || [];

  const isNewCategory = !options.some(
    (option) => option.label.toLowerCase() === customInput.toLowerCase()
  );

  //TODO add support for errors

  return (
    <FormControl fullWidth>
      <Autocomplete
        {...autocompleteProps}
        loading={isLoading || isFetching}
        value={options.find((o) => o.key === selected) || undefined}
        clearIcon={null}
        onInput={(e) => setCustomInput((e.target as any).value)}
        options={options}
        onChange={(e, value, reason, details) => {
          if (!value || typeof value === "string") return;
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
          />
        )}
        freeSolo
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
