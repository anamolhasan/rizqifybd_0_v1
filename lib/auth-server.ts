import { SERVER_API_BASE_URL } from "./constants";
import { decodeAccessToken } from "./jwt";

export interface RefreshedTokens {
  accessToken: string;
  refreshToken: string;
  sessionToken: string;
  userId: string;
  role: string;
}

export function buildCookieHeader(
  cookies: { name: string; value: string }[],
): string | undefined {
  const values = cookies.map((cookie) => `${cookie.name}=${cookie.value}`);
  return values.length ? values.join("; ") : undefined;
}

export async function refreshTokensOnServer(
  cookieHeader?: string,
): Promise<RefreshedTokens | null> {
  try {
    const response = await fetch(`${SERVER_API_BASE_URL}/auth/refresh`, {
      method: "POST",
      cache: "no-store",
      headers: {
        "Content-Type": "application/json",
        Accept: "application/json",
        ...(cookieHeader ? { Cookie: cookieHeader } : {}),
      },
    });

    if (!response.ok) {
      return null;
    }

    const payload = (await response.json()) as {
      success?: boolean;
      data?: {
        accessToken?: string;
        refreshToken?: string;
        token?: string;
      };
    };

    const data = payload?.data;
    if (payload?.success === false || !data?.accessToken || !data?.refreshToken || !data?.token) {
      return null;
    }

    const decoded = decodeAccessToken(data.accessToken);
    if (!decoded) {
      return null;
    }

    return {
      accessToken: data.accessToken,
      refreshToken: data.refreshToken,
      sessionToken: data.token,
      userId: decoded.userId,
      role: decoded.role,
    };
  } catch {
    return null;
  }
}