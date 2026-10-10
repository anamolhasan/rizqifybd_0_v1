import { createHmac, timingSafeEqual } from "node:crypto";

import { Role } from "@/types/enums";

export interface AccessTokenPayload {
  userId: string;
  role: Role;
  name: string;
  email: string;
  iat?: number;
  exp?: number;
}

export interface VerifyResult {
  success: true;
  data: AccessTokenPayload;
}

export interface VerifyFailure {
  success: false;
  message: string;
}

function getSecretKey(secret: string): Buffer {
  return Buffer.from(secret, "utf-8");
}

function base64UrlDecode(input: string): string {
  const base64 = input.replace(/-/g, "+").replace(/_/g, "/");
  const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
  return Buffer.from(padded, "base64").toString("utf-8");
}

export function decodeAccessToken(token: string): AccessTokenPayload | null {
  try {
    const parts = token.split(".");
    if (parts.length !== 3) return null;
    const payload = JSON.parse(base64UrlDecode(parts[1])) as AccessTokenPayload;
    return payload;
  } catch {
    return null;
  }
}

export function verifyAccessToken(
  token: string,
  secret: string,
): VerifyResult | VerifyFailure {
  if (!secret) {
    return { success: false, message: "ACCESS_TOKEN_SECRET is not configured" };
  }

  const parts = token.split(".");
  if (parts.length !== 3) {
    return { success: false, message: "Token has an invalid format" };
  }

  const [header, payload, signature] = parts;

  const expectedSignature = createHmac("sha256", getSecretKey(secret))
    .update(`${header}.${payload}`)
    .digest("base64url");

  const expectedBuffer = Buffer.from(expectedSignature);
  const actualBuffer = Buffer.from(signature);
  if (
    expectedBuffer.length !== actualBuffer.length ||
    !timingSafeEqual(expectedBuffer, actualBuffer)
  ) {
    return { success: false, message: "Token signature verification failed" };
  }

  const decoded = decodeAccessToken(token);
  if (!decoded) {
    return { success: false, message: "Token payload could not be decoded" };
  }

  if (decoded.exp) {
    const nowInSeconds = Math.floor(Date.now() / 1000);
    if (nowInSeconds > decoded.exp) {
      return { success: false, message: "Token has expired" };
    }
  }

  return { success: true, data: decoded };
}