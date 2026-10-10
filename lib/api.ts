export const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, "") ?? "/api/v1";

export interface ApiEnvelope<T> {
  success: boolean;
  message: string;
  data: T;
  meta?: unknown;
}

export interface ApiErrorSource {
  path: string;
  message: string;
}

export class ApiError extends Error {
  status: number;
  errorSources?: ApiErrorSource[];

  constructor(message: string, status: number, errorSources?: ApiErrorSource[]) {
    super(message);
    this.name = "ApiError";
    this.status = status;
    this.errorSources = errorSources;
  }
}

interface BackendError {
  success?: boolean;
  message?: string;
  errorSources?: ApiErrorSource[];
}

const AUTH_PATHS = new Set(["/auth/login", "/auth/register", "/auth/refresh"]);

let refreshPromise: Promise<boolean> | null = null;

async function refreshSessionOnce(): Promise<boolean> {
  if (!refreshPromise) {
    refreshPromise = (async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/auth/refresh`, {
          method: "POST",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        });
        return response.ok;
      } catch {
        return false;
      } finally {
        refreshPromise = null;
      }
    })();
  }
  return refreshPromise;
}

export async function apiRequest<T>(
  path: string,
  init: RequestInit = {},
  options: { skipAuthRefresh?: boolean } = {},
): Promise<ApiEnvelope<T>> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    ...init,
    credentials: "include",
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...init.headers,
    },
  });

  let payload: BackendError | ApiEnvelope<T> | null = null;
  try {
    payload = (await response.json()) as BackendError | ApiEnvelope<T>;
  } catch {
    payload = null;
  }

  if (!response.ok || payload?.success === false) {
    if (
      response.status === 401 &&
      !options.skipAuthRefresh &&
      !AUTH_PATHS.has(path)
    ) {
      const refreshed = await refreshSessionOnce();
      if (refreshed) {
        return apiRequest<T>(path, init, { skipAuthRefresh: true });
      }
    }

    const message =
      payload?.message ?? `Request failed with status ${response.status}`;
    throw new ApiError(
      message,
      response.status,
      (payload as BackendError | null)?.errorSources,
    );
  }

  return payload as ApiEnvelope<T>;
}
