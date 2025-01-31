import { AxiosError } from "axios";
import api from '../services/axiosInstance';
import { AuthResponse } from '../Models/Authentication'; 

export const apiCall = async <T>(
  url: string,
  method: "POST" | "GET" | "PUT" | "DELETE",
  data: object | null = null,
  defaultResponse: T
): Promise<AuthResponse> => {
  try {
    const response = await api({
      method,
      url,
      data,
    });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      const serverError = error.response?.data;
      // Return error response matching AuthResponse
      return {
        res: false,
        responseError: {
          msg: serverError?.responseError?.msg || "Unable to process the request.",
          errCode: serverError?.responseError?.errCode || "Unknown error code",
          msgAPI: serverError?.responseError?.msgAPI || "API error",
        },
      };
    }
    // Return a fallback error response
    return {
      res: false,
      responseError: {
        msg: "An unexpected error occurred.",
        errCode: "500",
        msgAPI: "Unknown API error",
      },
    };
  }
};
