import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import { useEffect, useState } from "react";
import { useGetCategories } from "../../hooks/use-get-categories";
import { IdLabel } from "../../models/shared";
import { mapCategoryToSelectOption } from "../../utils/mappers";

export type CategoryOptionType = IdLabel;

export const CategorySelect = (props: SelectProps & { showAll?: boolean }) => {
  const [categories, setCategories] = useState<CategoryOptionType[]>([]);

  const { data } = useGetCategories({});
  useEffect(() => {
    if (!data.data) return;
    setCategories(
      data.data.map((category) => mapCategoryToSelectOption(category))
    );
  }, [data]);

  return (
    <FormControl fullWidth>
      <InputLabel id="category-select-label">Categories</InputLabel>
      <Select labelId="category-select-label" id="category-select" {...props}>
        {!!props.showAll && <MenuItem value={0}>All</MenuItem>}
        {categories.map((category) => (
          <MenuItem key={category.id} value={category.id}>
            {category.label}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
