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
import { APIS } from "../constants";

export class CategoriesService {
  private static apiPostfix = APIS.categories;

  static async getCategories(filters: GetCategoriesFilters) {
    const url = buildUrl(this.apiPostfix, filters);
    const response = await httpClient.get<
      ApiResponse<CategoryModel[]>,
      AxiosPromise<ApiResponse<CategoryModel[]>> | AxiosError<ApiResponse>
    >(url);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async addCategory(category: AddCategoryPayload) {
    const response = await httpClient.post<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      AddCategoryPayload
    >(this.apiPostfix, category);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async updateUpdatedAt(categoryId: string) {
    const response = await httpClient.patch<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>
    >(`${this.apiPostfix}/${categoryId}`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async deleteCategory(categoryId: string) {
    const response = await httpClient.delete<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>
    >(`${this.apiPostfix}/${categoryId}`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async bulkDeleteCategories(ids: string[]) {
    const response = await httpClient.delete<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      BulkDeleteCategoriesPayload
    >(`${this.apiPostfix}/bulk/delete`, { data: { ids } });
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async updateCategory(category: UpdateCategoryPayload) {
    const response = await httpClient.put<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      UpdateCategoryPayload
    >(`${this.apiPostfix}/${category.id}`, category);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }
}
