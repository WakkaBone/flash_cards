import { AxiosError, AxiosPromise } from "axios";
import httpClient from "../http-client";
import {
  AddUserPayload,
  ApiResponse,
  BulkDeleteUsersPayload,
  UpdateUserPayload,
} from "../models/api";
import { buildUrl } from "../utils/url-util";
import { handleError } from "../utils/error-handler";
import { CategoryModel } from "../models/category";
import { GetUsersFilters } from "../models/filters";

const apiPostfix = "/users";

export const UsersService = {
  async getUsers(filters: GetUsersFilters) {
    const url = buildUrl(apiPostfix, filters);
    const response = await httpClient.get<
      ApiResponse<CategoryModel[]>,
      AxiosPromise<ApiResponse<CategoryModel[]>> | AxiosError<ApiResponse>
    >(url);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async addUser(user: AddUserPayload) {
    const response = await httpClient.post<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      AddUserPayload
    >(apiPostfix, user);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async deleteUser(userId: string) {
    const response = await httpClient.delete<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>
    >(`${apiPostfix}/${userId}`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async bulkDeleteUsers(ids: string[]) {
    const response = await httpClient.delete<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      BulkDeleteUsersPayload
    >(`${apiPostfix}/bulk/delete`, { data: { ids } });
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async updateUser(user: UpdateUserPayload) {
    const response = await httpClient.put<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      UpdateUserPayload
    >(`${apiPostfix}/${user.id}`, user);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },
};
