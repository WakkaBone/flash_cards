import { AxiosError, AxiosPromise } from "axios";
import httpClient from "../http-client";
import {
  AddCategoryPayload,
  ApiResponse,
  BulkDeleteCategoriesPayload,
  UpdateCategoryPayload,
} from "../models/api";
import { buildUrl } from "../utils/url-util";
import { handleError } from "../utils/error-handler";
import { CategoryModel } from "../models/category";
import { GetCategoriesFilters } from "../models/filters";

const apiPostfix = "/categories";

export const CategoriesService = {
  async getCategories(filters: GetCategoriesFilters) {
    const url = buildUrl(apiPostfix, filters);
    const response = await httpClient.get<
      ApiResponse<CategoryModel[]>,
      AxiosPromise<ApiResponse<CategoryModel[]>> | AxiosError<ApiResponse>
    >(url);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async addCategory(category: AddCategoryPayload) {
    const response = await httpClient.post<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      AddCategoryPayload
    >(apiPostfix, category);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async updateUpdatedAt(categoryId: string) {
    const response = await httpClient.patch<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>
    >(`${apiPostfix}/${categoryId}`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async deleteCategory(categoryId: string) {
    const response = await httpClient.delete<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>
    >(`${apiPostfix}/${categoryId}`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async bulkDeleteCategories(ids: string[]) {
    const response = await httpClient.delete<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      BulkDeleteCategoriesPayload
    >(`${apiPostfix}/bulk/delete`, { data: { ids } });
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async updateCategory(category: UpdateCategoryPayload) {
    const response = await httpClient.put<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      UpdateCategoryPayload
    >(`${apiPostfix}/${category.id}`, category);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },
};
