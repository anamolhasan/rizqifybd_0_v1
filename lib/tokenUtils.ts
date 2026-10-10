const TOKEN_EXPIRY_MARGIN_SECONDS = 60;

export function getTokenExpirationSeconds(
  token: string | null | undefined,
): number {
  if (!token) return 0;

  try {
    const payloadBase64 = token.split(".")[1];
    if (!payloadBase64) return 0;
    const base64 = payloadBase64.replace(/-/g, "+").replace(/_/g, "/");
    const padded = base64.padEnd(Math.ceil(base64.length / 4) * 4, "=");
    const payload = JSON.parse(Buffer.from(padded, "base64").toString("utf-8"));
    return payload.exp ? Number(payload.exp) - TOKEN_EXPIRY_MARGIN_SECONDS : 1;
  } catch {
    return 0;
  }
}

export function isTokenExpiringSoon(token: string | null | undefined): boolean {
  const expirationSeconds = getTokenExpirationSeconds(token);
  if (expirationSeconds <= 0) return true;
  return Math.floor(Date.now() / 1000) >= expirationSeconds;
}