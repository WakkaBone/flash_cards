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
import { APIS } from "../constants";

export class UsersService {
  private static apiPostfix = APIS.users;

  static async getUsers(filters: GetUsersFilters) {
    const url = buildUrl(this.apiPostfix, filters);
    const response = await httpClient.get<
      ApiResponse<CategoryModel[]>,
      AxiosPromise<ApiResponse<CategoryModel[]>> | AxiosError<ApiResponse>
    >(url);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async addUser(user: AddUserPayload) {
    const response = await httpClient.post<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      AddUserPayload
    >(this.apiPostfix, user);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async deleteUser(userId: string) {
    const response = await httpClient.delete<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>
    >(`${this.apiPostfix}/${userId}`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async bulkDeleteUsers(ids: string[]) {
    const response = await httpClient.delete<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      BulkDeleteUsersPayload
    >(`${this.apiPostfix}/bulk/delete`, { data: { ids } });
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async updateUser(user: UpdateUserPayload) {
    const response = await httpClient.put<
      ApiResponse,
      AxiosPromise<ApiResponse> | AxiosError<ApiResponse>,
      UpdateUserPayload
    >(`${this.apiPostfix}/${user.id}`, user);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }
}
