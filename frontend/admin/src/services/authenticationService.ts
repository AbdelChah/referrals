import { apiCall } from "../helpers/apiCall";
import { saveTokens } from "../helpers/tokenHelper";
import {
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  AuthResponse,
  OtpRequest,
  OtpResponse,
} from "../Models/Authentication";

const defaultAuthResponse: AuthResponse = {
  res: false,
  responseError: {
    msg: "An unexpected error occurred.",
    errCode: "500",
    msgAPI: "Unable to process the request.",
  },
};

const defaultOtpResponse: OtpResponse = {
  res: false,
  response: {
    msg: "An error occurred while validating OTP.",
    data: { accessToken: "", refreshToken: "" },
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


export const validateOtpService = async (otpRequest: OtpRequest): Promise<OtpResponse> => {
  try {
    const response = await apiCall("/api/auth/verifyOTP", "POST",otpRequest, defaultOtpResponse);

    if (response.res && response.response?.data) {
      const { accessToken, refreshToken } = response.response.data;
      saveTokens(accessToken, refreshToken);
    }

    return response;
  } catch (error) {
    console.error("Validate OTP service error:", error);
    return {
      res: false,
      responseError: {
        msg: "OTP validation failed.",
        errCode: "VALIDATE_OTP_ERROR",
        msgAPI: "Unable to validate OTP. Please try again.",
      },
    };
  }
};

export const refreshTokenService = async (
  refreshToken: string
): Promise<AuthResponse> =>
  apiCall("/api/auth/refresh", "POST", { refreshToken }, defaultAuthResponse);


