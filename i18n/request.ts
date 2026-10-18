import { cookies } from "next/headers";
import { getRequestConfig } from "next-intl/server";

import { defaultLocale, isLocale, LOCALE_COOKIE, type Locale } from "./config";

const ROOT_NAMESPACES = [
  "common",
  "nav",
  "pagination",
  "theme",
  "footer",
  "toast",
  "enums",
  "auth",
  "validation",
  "metadata",
  "dashboard",
  "dashboardNav",
  "profile",
  "agent",
  "affiliate",
  "referral",
  "adminNav",
  "faq",
  "error",
  "notFound",
  "loading",
  "features",
  "offers",
  "orders",
] as const;

const ADMIN_NAMESPACES = [
  "dashboard",
  "placeholders",
  "users",
  "roleAccess",
  "operatorOffers",
  "operators",
  "referralApplications",
  "agentApplications",
  "affiliateApplications",
  "settings",
  "operatorOfferForm",
  "operatorForm",
  "operatorOfferProfit",
  "orders",
] as const;

export default getRequestConfig(async ({ locale }) => {
  const cookieStore = await cookies();
  const cookieLocale = cookieStore.get(LOCALE_COOKIE)?.value;

  const resolvedLocale: Locale = isLocale(locale)
    ? locale
    : isLocale(cookieLocale)
      ? cookieLocale
      : defaultLocale;

  const messages: Record<string, unknown> = {};

  for (const ns of ROOT_NAMESPACES) {
    const mod = await import(`../messages/${resolvedLocale}/${ns}.json`);
    messages[ns] = mod.default;
  }

  const adminMessages: Record<string, unknown> = {};
  for (const ns of ADMIN_NAMESPACES) {
    const mod = await import(`../messages/${resolvedLocale}/admin/${ns}.json`);
    adminMessages[ns] = mod.default;
  }
  messages.admin = adminMessages;

  return {
    locale: resolvedLocale,
    messages,
  };
});