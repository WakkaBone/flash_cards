import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse, GetCategoriesFilters } from "../../models/api";
import { CategoryModel } from "../../models/category";
import { CategoriesService } from "../../services/categories-service";
import { QUERY_KEYS } from "../../constants";

export const getCategoriesQuery = (
  filters: GetCategoriesFilters
): DefinedInitialDataOptions<ApiResponse<CategoryModel[]>> => ({
  initialData: { isSuccess: false, data: [] },
  queryKey: [QUERY_KEYS.categories, filters],
  queryFn: async () => await CategoriesService.getCategories(filters),
});
