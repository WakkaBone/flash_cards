import { useQuery } from "@tanstack/react-query";
import { ApiResponse } from "../../models/api";
import { CategoryModel } from "../../models/category";
import { getCategoriesQuery } from "../../queries/categories";
import { GetCategoriesFilters } from "../../models/filters";

export const useGetCategories = (filters: GetCategoriesFilters) => {
  const getCategories = useQuery<ApiResponse<CategoryModel[]>>(
    getCategoriesQuery(filters)
  );
  return getCategories;
};
