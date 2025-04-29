import { AxiosError, AxiosPromise } from "axios";
import httpClient from "../http-client";
import {
  AddUserPayload,
  ApiResponse,
  BulkDeleteUsersPayload,
  GetPracticeTimelineFilters,
  GetUserDynamicsFilters,
  GetUsersFilters,
  UpdateUserPayload,
} from "../models/api";
import { buildUrl } from "../utils/url-util";
import { handleError } from "../utils/error-handler";
import { CategoryModel } from "../models/category";
import { GetUsersDynamicsDto, TimelinePoint } from "../models/statistics";

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

  async getPracticeTimeline(filters: GetPracticeTimelineFilters) {
    const url = buildUrl(`${apiPostfix}/timeline`, filters);
    const response = await httpClient.get<
      ApiResponse<TimelinePoint[]>,
      AxiosPromise<ApiResponse<TimelinePoint[]>> | AxiosError<ApiResponse>
    >(url);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async getUsersDynamics(filters: GetUserDynamicsFilters) {
    const url = buildUrl(`${apiPostfix}/dynamics`, filters);
    const response = await httpClient.get<
      ApiResponse<GetUsersDynamicsDto>,
      AxiosPromise<ApiResponse<GetUsersDynamicsDto>> | AxiosError<ApiResponse>
    >(url);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },
};
