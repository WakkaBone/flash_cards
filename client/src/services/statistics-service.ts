import { AxiosError, AxiosPromise } from "axios";
import httpClient from "../http-client";
import { ApiResponse } from "../models/api";
import {
  GetCardsDynamicsDto,
  GetUsersDynamicsDto,
  Statistics,
  StatisticsAdmin,
  TimelinePoint,
} from "../models/statistics";
import { handleError } from "../utils/error-handler";
import { buildUrl } from "../utils/url-util";
import {
  GetCardDynamicsFilters,
  GetPracticeTimelineFilters,
  GetUserDynamicsFilters,
} from "../models/filters";

const apiPostfix = "/statistics";

export const StatisticsService = {
  async getPracticeTimeline(filters: GetPracticeTimelineFilters) {
    const url = buildUrl(`${apiPostfix}/timeline`, filters);
    const response = await httpClient.get<
      ApiResponse<TimelinePoint[]>,
      AxiosPromise<ApiResponse<TimelinePoint[]>> | AxiosError<ApiResponse>
    >(url);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async getCardsDynamics(filters: GetCardDynamicsFilters) {
    const url = buildUrl(`${apiPostfix}/cards-dynamics`, filters);
    const response = await httpClient.get<
      ApiResponse<GetCardsDynamicsDto>,
      AxiosPromise<ApiResponse<GetCardsDynamicsDto>> | AxiosError<ApiResponse>
    >(url);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async getUsersDynamics(filters: GetUserDynamicsFilters) {
    const url = buildUrl(`${apiPostfix}/users-dynamics`, filters);
    const response = await httpClient.get<
      ApiResponse<GetUsersDynamicsDto>,
      AxiosPromise<ApiResponse<GetUsersDynamicsDto>> | AxiosError<ApiResponse>
    >(url);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async getStatistics() {
    const response = await httpClient.get<
      ApiResponse<Statistics>,
      AxiosPromise<ApiResponse<Statistics>> | AxiosError<ApiResponse>
    >(`${apiPostfix}/counters`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },

  async getAdminStatistics() {
    const response = await httpClient.get<
      ApiResponse<Statistics>,
      AxiosPromise<ApiResponse<StatisticsAdmin>> | AxiosError<ApiResponse>
    >(`${apiPostfix}/counters-admin`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  },
};
