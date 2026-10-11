import { apiRequest } from "./api";
import { buildQueryString } from "./query";

import type { ApiResponse, ListQueryParams, PaginationMeta } from "@/types/api.types";
import type { ICreateUserPayload, IUser, IUserDetail } from "@/types/user.types";

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
  params: ListQueryParams = {},
): Promise<ApiResponse<IUser[]>> {
  const query = buildQueryString(params);
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