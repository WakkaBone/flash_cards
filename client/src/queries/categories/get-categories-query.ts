import { DefinedInitialDataOptions } from "@tanstack/react-query";
import { ApiResponse, GetCategoriesFilters } from "../../models/api";
import { CategoryModel } from "../../models/category";
import { CategoriesService } from "../../services/categories-service";

export const getCategoriesQuery = (
  filters: GetCategoriesFilters
): DefinedInitialDataOptions<ApiResponse<CategoryModel[]>, Error> => ({
  initialData: { isSuccess: false, data: [] },
  queryKey: ["categories", filters],
  queryFn: async () => await CategoriesService.getCategories(filters),
});
