function getAppOrigin(): string {
  const configuredUrl = process.env.NEXT_PUBLIC_APP_URL?.trim().replace(/\/+$/, "");
  if (configuredUrl) {
    return configuredUrl;
  }
  if (typeof window !== "undefined") {
    return window.location.origin;
  }
  return "";
}

export function buildReferralPath(code: string): string {
  return `/sign-up?ref=${encodeURIComponent(code)}`;
}

export function buildReferralLink(code: string): string {
  return `${getAppOrigin()}${buildReferralPath(code)}`;
}