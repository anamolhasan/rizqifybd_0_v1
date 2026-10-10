import { cookies } from "next/headers";

import { ApiErrorSource } from "@/types/api.types";

import { SERVER_API_BASE_URL } from "../constants";

export class ServerApiError extends Error {
  status: number;
  errorSources?: ApiErrorSource[];

  constructor(
    message: string,
    status: number,
    errorSources?: ApiErrorSource[],
  ) {
    super(message);
    this.name = "ServerApiError";
    this.status = status;
    this.errorSources = errorSources;
  }
}

interface BackendErrorBody {
  success?: boolean;
  message?: string;
  errorSources?: ApiErrorSource[];
}

async function buildCookieHeader(): Promise<string | undefined> {
  const cookieStore = await cookies();
  const values = cookieStore
    .getAll()
    .map((cookie) => `${cookie.name}=${cookie.value}`)
    .join("; ");
  return values || undefined;
}

export async function serverFetch<TData>(
  path: string,
  init: RequestInit = {},
): Promise<TData> {
  const cookieHeader = await buildCookieHeader();

  const response = await fetch(`${SERVER_API_BASE_URL}${path}`, {
    ...init,
    cache: "no-store",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      ...init.headers,
    },
  });

  let payload: BackendErrorBody | TData | null = null;
  try {
    payload = (await response.json()) as BackendErrorBody | TData;
  } catch {
    payload = null;
  }

  if (!response.ok || (payload as BackendErrorBody | null)?.success === false) {
    const errorBody = payload as BackendErrorBody | null;
    throw new ServerApiError(
      errorBody?.message ?? `Request failed with status ${response.status}`,
      response.status,
      errorBody?.errorSources,
    );
  }

  return payload as TData;
}