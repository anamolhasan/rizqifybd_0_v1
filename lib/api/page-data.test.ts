import { afterEach, describe, expect, it, vi } from "vitest";

import { ServerApiError } from "./server-fetch";
import { loadPageData } from "./page-data";

const response = <T>(data: T) => ({ success: true as const, message: "ok", data });

afterEach(() => {
  vi.restoreAllMocks();
});

describe("loadPageData", () => {
  it("unwraps the API response on success", async () => {
    const result = await loadPageData(Promise.resolve(response([1, 2, 3])));

    expect(result).toEqual({ status: "ok", data: [1, 2, 3] });
  });

  it("reports an expired session as unauthorized", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const result = await loadPageData(
      Promise.reject(new ServerApiError("Unauthorized", 401)),
    );

    expect(result).toEqual({ status: "unauthorized" });
  });

  it("reports a missing programme membership as forbidden, not an error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const result = await loadPageData(
      Promise.reject(new ServerApiError("Forbidden access!", 403)),
    );

    expect(result).toEqual({ status: "forbidden" });
  });

  it("reports a backend failure as an error instead of throwing", async () => {
    const logged = vi.spyOn(console, "error").mockImplementation(() => undefined);

    const result = await loadPageData(
      Promise.reject(
        new ServerApiError('Prisma Client Known Request Error: table "x"', 500),
      ),
    );

    expect(result).toEqual({ status: "error" });
    // The raw backend message is logged, never returned to the UI.
    expect(logged).toHaveBeenCalled();
  });

  it("reports an unexpected rejection as an error", async () => {
    vi.spyOn(console, "error").mockImplementation(() => undefined);

    const result = await loadPageData(Promise.reject(new Error("boom")));

    expect(result).toEqual({ status: "error" });
  });

  it("never rejects, whatever the backend answers", async () => {
    await expect(
      loadPageData(
        Promise.reject(new ServerApiError("Service Unavailable", 503)),
      ),
    ).resolves.toEqual({ status: "error" });
  });
});
