import { AxiosPromise } from "axios";
import httpClient from "../http-client";
import { ApiResponse } from "../models/api";
import { getAppVersion } from "../utils/version";

const apiPostfix = "/version";

export const VersionsService = {
  getClientAppVersion() {
    return getAppVersion();
  },
  async getServerAppVersion() {
    const { data: response } = await httpClient.get<
      ApiResponse<string>,
      AxiosPromise<ApiResponse<string>>
    >(`${apiPostfix}`);
    return response;
  },
};
