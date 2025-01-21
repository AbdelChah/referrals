// types.ts

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

export interface Admin {
  id: string;
  name: string;
}

export interface LoginResponse {
  res: boolean;
  response?: {
    msg: string;
    data: {
      otp: string;
      otpExpirationMinutes: number;
    };
    responseError?: {
      msg: string;
      errCode: string;
      msgAPI: string;
    };
  };
}
export interface AuthResponse {
  res: boolean;
  response?: {
    msg: string;
    data?: Record<string, any>; // To handle varying response structures like OTP or tokens
  };
  responseError?: {
    msg: string;
    errCode: string;
    msgAPI: string;
  };
}

export interface OtpRequest {
  username: string;
  otp: string;
}

export interface OtpResponse {
  res: boolean;
  responseError?: {
    msg: string;
    errCode: string;
    msgAPI: string;
  };
  response?: {
    msg: string;
    data: {
      accessToken: string;
      refreshToken: string;
    };
  };
}
