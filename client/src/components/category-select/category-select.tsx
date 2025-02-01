import {
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  SelectProps,
} from "@mui/material";
import { Categories } from "../../models/card";
import { categoryMapper } from "../../utils/mappers";

export const CategorySelect = (props: SelectProps & { showAll?: boolean }) => {
  const categories = Object.values(Categories).filter(
    (key) => !isNaN(Number(key))
  ) as Categories[];

  return (
    <FormControl fullWidth>
      <InputLabel id="category-select-label">Categories</InputLabel>
      <Select labelId="category-select-label" id="category-select" {...props}>
        {!!props.showAll && <MenuItem value={0}>All</MenuItem>}
        {categories.map((category) => (
          <MenuItem key={category} value={category}>
            {categoryMapper[category]}
          </MenuItem>
        ))}
      </Select>
    </FormControl>
  );
};
