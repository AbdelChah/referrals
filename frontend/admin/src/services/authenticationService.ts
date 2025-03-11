import { Admin } from "@/Models/Admins";
import { apiCall } from "../helpers/apiCall";
import {
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  AuthResponse,
  OtpRequest,
  FecthAdminsResponse,
} from "../Models/Authentication";
import admins from "../Models/Mock/admins.json";
import api from "./axiosInstance";

const defaultAuthResponse: AuthResponse = {
  res: false,
  responseError: {
    msg: "An unexpected error occurred.",
    errCode: "500",
    msgAPI: "Unable to process the request.",
  },
};

// Services
export const loginService = async (data: LoginRequest): Promise<AuthResponse> =>
  apiCall("/api/auth/login", "POST", data, defaultAuthResponse);

export const logoutService = async (
  refreshToken: string
): Promise<AuthResponse> =>
  apiCall("/api/auth/logout", "POST", { refreshToken }, defaultAuthResponse);

export const registerService = async (
  data: RegisterRequest
): Promise<AuthResponse> =>
  apiCall("/api/auth/register", "POST", data, defaultAuthResponse);

export const resetPasswordService = async (
  data: ResetPasswordRequest
): Promise<AuthResponse> =>
  apiCall("/api/auth/resetPassword", "POST", data, defaultAuthResponse);

export const validateOtpService = async (
  otpRequest: OtpRequest
): Promise<AuthResponse> =>
  apiCall("/api/auth/verifyOTP", "POST", otpRequest, defaultAuthResponse);

export const refreshTokenService = async (
  refreshToken: string
): Promise<AuthResponse> =>
  apiCall("/api/auth/refresh", "POST", { refreshToken }, defaultAuthResponse);


export const fetchAdmins = async (): Promise<Admin[] | undefined> => {
  try {
    const response = await api.get<FecthAdminsResponse>("/api/auth/getAdmins");
    console.log("response: ", response.data.response);
    return response.data.response; // Return only the `referrals` array
  } catch (error) {
    console.error("Error fetching referrals:", error);
    throw error;
  }
};

// Mock function to simulate deleting an admin by id tp be replaced.
export const deleteAdmin = async (adminId: string): Promise<void> => {
  return new Promise((resolve, reject) => {
    // Simulate a delay as if calling an API
    setTimeout(() => {
      // Simulate deleting the admin with the given id
      const adminIndex = admins.findIndex((admin) => admin.id === adminId);

      if (adminIndex !== -1) {
        admins.splice(adminIndex, 1);
        resolve();
      } else {
        reject(new Error("Admin not found"));
      }
    }, 1000);
  });
};
