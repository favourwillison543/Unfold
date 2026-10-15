export type AuthUser = {
  id: number;
  name: string;
  email: string;
};

export type CreateAccountRequest = {
  name: string;
  email: string;
  password: string;
};

export type CreateAccountResponse = {
  message: string;
  email: string;
};

export type VerifyEmailRequest = {
  email: string;
  otp: string;
};

export type VerifyEmailResponse = {
  user: AuthUser;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: AuthUser;
};

export type GetMeResponse = AuthUser;