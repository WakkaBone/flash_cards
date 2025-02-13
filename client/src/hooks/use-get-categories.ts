import { useQuery } from "@tanstack/react-query";
import { ApiResponse, GetCategoriesFilters } from "../models/api";
import { CategoryModel } from "../models/category";
import { getCategoriesQuery } from "../queries/categories/get-categories-query";

export const useGetCategories = (filters: GetCategoriesFilters) => {
  const getCategories = useQuery<ApiResponse<CategoryModel[]>>(
    getCategoriesQuery(filters)
  );
  return getCategories;
};
