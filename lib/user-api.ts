import { apiRequest } from "./api";
import { buildQueryString } from "./query";

import type { ApiResponse, PaginationMeta } from "@/types/api.types";
import type {
  ICreateUserPayload,
  IDeleteUserResult,
  IUpdateUserProfilePayload,
  IUpdateUserRolePayload,
  IUpdateUserStatusPayload,
  IUser,
  IUserDetail,
  IUserListParams,
  IUserStats,
} from "@/types/user.types";

// The backend exposes staff/user management at /api/v1/users.
const USERS_ENDPOINT = "/users";

export async function createStaffUser(
  payload: ICreateUserPayload,
): Promise<IUserDetail> {
  const { data } = await apiRequest<IUserDetail>(USERS_ENDPOINT, {
    method: "POST",
    body: JSON.stringify(payload),
  });

  return data;
}

export async function getUsers(
  params: IUserListParams = {},
): Promise<ApiResponse<IUser[]>> {
  const query = buildQueryString({
    page: params.page,
    limit: params.limit,
    sortBy: params.sortBy,
    sortOrder: params.sortOrder,
    searchTerm: params.searchTerm,
    role: params.role,
    status: params.status,
    isDeleted:
      params.isDeleted === undefined ? undefined : String(params.isDeleted),
  });
  const { data, message, meta } = await apiRequest<IUser[]>(
    `${USERS_ENDPOINT}${query}`,
    { method: "GET" },
  );

  return {
    success: true,
    message,
    data,
    meta: meta as PaginationMeta | undefined,
  };
}

export async function getUserStats(): Promise<IUserStats> {
  const { data } = await apiRequest<IUserStats>(`${USERS_ENDPOINT}/stats`, {
    method: "GET",
  });

  return data;
}

export async function getUserById(id: string): Promise<IUserDetail> {
  const { data } = await apiRequest<IUserDetail>(
    `${USERS_ENDPOINT}/${encodeURIComponent(id)}`,
    { method: "GET" },
  );

  return data;
}

export async function updateUserProfile(
  id: string,
  payload: IUpdateUserProfilePayload,
): Promise<IUserDetail> {
  const { data } = await apiRequest<IUserDetail>(
    `${USERS_ENDPOINT}/${encodeURIComponent(id)}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
}

export async function updateUserStatus(
  id: string,
  payload: IUpdateUserStatusPayload,
): Promise<IUserDetail> {
  const { data } = await apiRequest<IUserDetail>(
    `${USERS_ENDPOINT}/${encodeURIComponent(id)}/status`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
}

export async function updateUserRole(
  id: string,
  payload: IUpdateUserRolePayload,
): Promise<IUserDetail> {
  const { data } = await apiRequest<IUserDetail>(
    `${USERS_ENDPOINT}/${encodeURIComponent(id)}/role`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
}

export async function deleteUser(id: string): Promise<IDeleteUserResult> {
  const { data } = await apiRequest<IDeleteUserResult>(
    `${USERS_ENDPOINT}/${encodeURIComponent(id)}`,
    { method: "DELETE" },
  );

  return data;
}

export async function restoreUser(id: string): Promise<IUserDetail> {
  const { data } = await apiRequest<IUserDetail>(
    `${USERS_ENDPOINT}/${encodeURIComponent(id)}/restore`,
    { method: "PATCH" },
  );

  return data;
}
