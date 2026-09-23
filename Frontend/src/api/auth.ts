import { get, post } from './client';

export interface AuthUser {
  _id: string;
  name: string;
  email: string;
  phone?: string | null;
  role: string;
}

export interface RegisterRequest {
  name: string;
  email: string;
  password: string;
  phone?: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface AuthResponse {
  success: boolean;
  data: AuthUser;
}

export interface CurrentUserResponse {
  success: boolean;
  data: AuthUser;
}

export function register(
  payload: RegisterRequest,
): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/register', payload);
}

export function login(
  payload: LoginRequest,
): Promise<AuthResponse> {
  return post<AuthResponse>('/auth/login', payload);
}

export function getCurrentUser(): Promise<CurrentUserResponse> {
  return get<CurrentUserResponse>('/auth/me');
}

export function logout(): Promise<{
  success: boolean;
  message: string;
}> {
  return post('/auth/logout', {});
}