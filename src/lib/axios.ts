import { HttpStatus, Messages } from "@/shared/utils";
import { ApiError } from "@/shared/utils/types/api";
import axios, { AxiosError } from "axios";

import https from "https";

const baseURL = process.env.NEXT_PUBLIC_API_URL;
console.log(`[Axios] Initializing with baseURL: '${baseURL}'`);

const api = axios.create({
  baseURL,
  headers: { 
    "Content-Type": "application/json",
    "Accept": "application/json"
  },
  httpsAgent: new https.Agent({  
    rejectUnauthorized: false 
  }),
});

api.interceptors.request.use(
  (config) => {
    if (typeof window !== "undefined") {
      const token = document.cookie
        .split("; ")
        .find((row) => row.startsWith("auth_token="))
        ?.split("=")[1];

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError<ApiError>) => {
    const originalRequest = error.config as any;

    if (error.response) {
      const status = error.response.status;

      if (status === HttpStatus.UNAUTHORIZED && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const { data } = await axios.post("/api/auth/refresh");
          if (data?.token) {
            originalRequest.headers.Authorization = `Bearer ${data.token}`;
            return api(originalRequest);
          }
        } catch (refreshError) {
          if (typeof window !== "undefined") {
            window.location.href = "/login";
          }
        }
      }

      const data = error.response.data;

      return Promise.reject(error);
    }
    return Promise.reject(error);
  }
);

export default api;
