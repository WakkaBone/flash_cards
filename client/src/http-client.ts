import axios, { AxiosInstance } from "axios";
import { getApiBaseUrl } from "./utils/env-util";

const instance = axios.create({
  baseURL: getApiBaseUrl(),
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
    async (error) => {
      console.log(error);
      return error;
    }
  );

  axiosInstance.interceptors.response.use(
    async (response) => {
      console.log(response);
      return response;
    },
    async (error) => {
      console.log(error);
      return error;
    }
  );

  return axiosInstance;
}

export default setupInterceptors(instance);
