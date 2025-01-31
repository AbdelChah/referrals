import { apiCall } from "../helpers/apiCall";
import { saveTokens } from "../helpers/tokenHelper";
import {
  LoginRequest,
  RegisterRequest,
  ResetPasswordRequest,
  AuthResponse,
  OtpRequest,
} from "../Models/Authentication";

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


export const validateOtpService = async (otpRequest: OtpRequest): Promise<AuthResponse> =>
apiCall("/api/auth/verifyOTP", "POST",otpRequest, defaultAuthResponse);


export const refreshTokenService = async (
  refreshToken: string
): Promise<AuthResponse> =>
  apiCall("/api/auth/refresh", "POST", { refreshToken }, defaultAuthResponse);


