import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { CategoryModel } from "../../models/category";
import { CategoriesService } from "../../services";
import { QUERY_KEYS } from "../../constants";
import { GetCategoriesFilters } from "../../models/filters";

export const getCategoriesQuery = (
  filters: GetCategoriesFilters
): DefinedInitialDataOptions<ApiResponse<CategoryModel[]>> => ({
  initialData: { isSuccess: false, data: [] },
  queryKey: [QUERY_KEYS.categories, filters],
  queryFn: async () => await CategoriesService.getCategories(filters),
});
