import axios, { AxiosError, AxiosInstance } from "axios";
import { ROUTES } from "./constants";

const instance = axios.create({
  baseURL: process.env.REACT_APP_API_BASE_URL || "http://localhost:5000",
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
      const isAuthRoute = window.location.pathname.startsWith(ROUTES.login);
      if (error.status === 401 && !isAuthRoute)
        window.location.href = ROUTES.login;
      return error;
    }
  );

  return axiosInstance;
}

export default setupInterceptors(instance);
