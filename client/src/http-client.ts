import axios, { AxiosError, AxiosInstance } from "axios";
import { getApiBaseUrl } from "./utils/env-util";

const instance = axios.create({
  baseURL: getApiBaseUrl(),
  withCredentials: true,
  headers: {
    "Content-type": "application/json",
  },
});

function setupInterceptors(axiosInstance: AxiosInstance): AxiosInstance {
  axiosInstance.interceptors.request.use(
    async (request) => {
      console.log(request);
      return request;
    },
    async (error: AxiosError) => {
      console.error(error);
      return error;
    }
  );

  axiosInstance.interceptors.response.use(
    async (response) => {
      console.log(response);
      return response;
    },
    async (error: AxiosError) => {
      console.error(error);
      if (error.status === 401) window.location.reload();
      return error;
    }
  );

  return axiosInstance;
}

export default setupInterceptors(instance);
