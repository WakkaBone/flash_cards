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
import { APIS } from "../constants";

export class StatisticsService {
  private static apiPostfix = APIS.statistics;

  static async getPracticeTimeline(filters: GetPracticeTimelineFilters) {
    const url = buildUrl(`${this.apiPostfix}/timeline`, filters);
    const response = await httpClient.get<
      ApiResponse<TimelinePoint[]>,
      AxiosPromise<ApiResponse<TimelinePoint[]>> | AxiosError<ApiResponse>
    >(url);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async getCardsDynamics(filters: GetCardDynamicsFilters) {
    const url = buildUrl(`${this.apiPostfix}/cards-dynamics`, filters);
    const response = await httpClient.get<
      ApiResponse<GetCardsDynamicsDto>,
      AxiosPromise<ApiResponse<GetCardsDynamicsDto>> | AxiosError<ApiResponse>
    >(url);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async getUsersDynamics(filters: GetUserDynamicsFilters) {
    const url = buildUrl(`${this.apiPostfix}/users-dynamics`, filters);
    const response = await httpClient.get<
      ApiResponse<GetUsersDynamicsDto>,
      AxiosPromise<ApiResponse<GetUsersDynamicsDto>> | AxiosError<ApiResponse>
    >(url);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async getStatistics() {
    const response = await httpClient.get<
      ApiResponse<Statistics>,
      AxiosPromise<ApiResponse<Statistics>> | AxiosError<ApiResponse>
    >(`${this.apiPostfix}/counters`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }

  static async getAdminStatistics() {
    const response = await httpClient.get<
      ApiResponse<Statistics>,
      AxiosPromise<ApiResponse<StatisticsAdmin>> | AxiosError<ApiResponse>
    >(`${this.apiPostfix}/counters-admin`);
    if (response instanceof AxiosError) return handleError(response);
    return response.data;
  }
}
