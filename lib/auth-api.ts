import { apiRequest } from "./api";
import type { IAppUser } from "@/types/user.types";

export interface LoginPayload {
  email: string;
  password: string;
}

export interface RegisterPayload {
  name: string;
  email: string;
  password: string;
}

export interface AuthUser {
  id: string;
  name: string;
  email: string;
  role: string;
  status?: string;
  emailVerified?: boolean;
  phone?: string | null;
  image?: string | null;
  createdAt?: string;
  phoneVerified?: boolean;
  needPasswordChange?: boolean;
  isDeleted?: boolean;
  deletedAt?: string | null;
  updatedAt?: string;
  appUser?: IAppUser | null;
}

export interface AuthResult {
  token?: string;
  accessToken?: string;
  refreshToken?: string;
  user: AuthUser;
  appUser?: unknown;
  session?: unknown;
}

export async function registerUser(payload: RegisterPayload) {
  const { data } = await apiRequest<AuthResult>("/auth/register", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data;
}

export async function loginUser(payload: LoginPayload) {
  const { data } = await apiRequest<AuthResult>("/auth/login", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data;
}

export async function getMe() {
  const { data } = await apiRequest<AuthUser>("/auth/me", {
    method: "GET",
  });
  return data;
}

export interface UpdateMyProfilePayload {
  name?: string;
  phone?: string;
  image?: string;
  profilePhoto?: string;
  contactNumber?: string;
  address?: string;
  country?: string;
}

export async function updateMyProfile(
  payload: UpdateMyProfilePayload,
): Promise<AuthUser> {
  const { data } = await apiRequest<AuthUser>("/auth/me", {
    method: "PATCH",
    body: JSON.stringify(payload),
  });
  return data;
}

export async function logoutUser() {
  const { data } = await apiRequest<null>("/auth/logout", {
    method: "POST",
  });
  return data;
}

export interface ChangePasswordPayload {
  currentPassword: string;
  newPassword: string;
}

export async function changePassword(payload: ChangePasswordPayload) {
  const { data } = await apiRequest<null>("/auth/change-password", {
    method: "POST",
    body: JSON.stringify(payload),
  });
  return data;
}