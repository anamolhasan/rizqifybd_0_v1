import type { ApiResponse } from "@/types/api.types";

import { ServerApiError } from "./server-fetch";

// The outcome of one server-side page fetch.
//
// A page must not let a single failing backend call take down the whole route.
// These cases are genuinely different and each gets its own treatment:
//   • "ok"           → render the data;
//   • "unauthorized" → the session is gone (an access token can expire before the
//                      middleware refreshes it), so the visitor goes to login;
//   • "forbidden"    → the account is not part of that programme yet. This is a
//                      normal state for the approved-only endpoints, not a fault;
//   • "error"        → the backend or database failed, surfaced as an error state
//                      instead of an unhandled exception.
export type PageData<T> =
  | { status: "ok"; data: T }
  | { status: "unauthorized" }
  | { status: "forbidden" }
  | { status: "error" };

export async function loadPageData<T>(
  promise: Promise<ApiResponse<T>>,
): Promise<PageData<T>> {
  try {
    const response = await promise;
    return { status: "ok", data: response.data };
  } catch (error) {
    if (error instanceof ServerApiError) {
      if (error.status === 401) return { status: "unauthorized" };
      if (error.status === 403) return { status: "forbidden" };

      // Logged server-side so the raw backend message (which can contain
      // internal detail) never reaches the UI.
      console.error(`Page data request failed (${error.status}):`, error.message);
      return { status: "error" };
    }

    console.error("Page data request failed:", error);
    return { status: "error" };
  }
}
