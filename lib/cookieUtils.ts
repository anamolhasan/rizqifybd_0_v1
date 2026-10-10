import { cookies } from "next/headers";

import { AUTH_COOKIE_NAMES } from "@/lib/constants";

export async function deleteAuthCookies() {
  const cookieStore = await cookies();
  for (const name of AUTH_COOKIE_NAMES) {
    cookieStore.delete(name);
  }
}