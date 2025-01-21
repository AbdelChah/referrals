import { AxiosError } from "axios";
import api from '../services/axiosInstance'; // import the configured axios instance

export const apiCall = async <T>(
  url: string,
  method: "POST" | "GET" | "PUT" | "DELETE",
  data: object | null = null,
  defaultResponse: T
): Promise<T> => {
  try {
    const response = await api({
      method,
      url,
      data,
    });
    return response.data as T;
  } catch (error) {
    if (error instanceof AxiosError) {
      const serverError = error.response?.data;
      if (serverError?.responseError?.msg) {
        throw new Error(serverError.responseError.msg); // Throw with a meaningful message
      } else {
        throw new Error("Unable to process the request."); // Fallback error message
      }
    }
    throw new Error("An unexpected error occurred."); // Non-Axios errors
  }
};
