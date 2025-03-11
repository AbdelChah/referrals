import { Admin } from "./Admins";

// types.ts
export interface ErrorResponse {
  msg: string;
  errCode: string;
  msgAPI: string;
}

export interface LoginRequest {
  username: string;
  password: string;
}

export interface RegisterRequest {
  username: string;
  password: string;
  email: string;
}

export interface ResetPasswordRequest {
  email: string;
  newPassword: string;
  username: string;
}
export interface LoginResponse {
  res: boolean;
  response?: {
    msg: string;
    data: {
      otp: string;
      otpExpirationMinutes: number;
    };
    responseError?: ErrorResponse;
  };
}
export interface AuthResponse {
  res: boolean;
  response?: {
    msg: string;
    data?: Record<string, any>; // To handle varying response structures like OTP or tokens
  };
  responseError?: ErrorResponse;
}

export interface OtpRequest {
  username: string;
  otp: string;
}

export interface FecthAdminsResponse {
  res: boolean;
  response?: Admin[];
  responseError?: ErrorResponse;
}
