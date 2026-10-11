import { apiRequest } from "./api";

import type { ICreateUserPayload, IUserDetail } from "@/types/user.types";

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