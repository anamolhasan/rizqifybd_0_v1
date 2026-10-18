import { apiRequest } from "./api";

import type {
  IAffiliateLink,
  ICreateAffiliateLinkPayload,
  IUpdateAffiliateLinkPayload,
} from "@/types/program.types";

// Client-side affiliate mutations. Reads for the dashboards run server-side via
// `services/services.ts`; the link manager is a client component, so it reuses
// the authenticated `apiRequest` helper (cookies are sent with
// `credentials: "include"`) exactly like the other client API modules.
const AFFILIATE_ENDPOINT = "/affiliate";

export async function createAffiliateLink(
  payload: ICreateAffiliateLinkPayload,
): Promise<IAffiliateLink> {
  const { data } = await apiRequest<IAffiliateLink>(
    `${AFFILIATE_ENDPOINT}/links`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return data;
}

export async function updateAffiliateLink(
  id: string,
  payload: IUpdateAffiliateLinkPayload,
): Promise<IAffiliateLink> {
  const { data } = await apiRequest<IAffiliateLink>(
    `${AFFILIATE_ENDPOINT}/links/${id}`,
    {
      method: "PATCH",
      body: JSON.stringify(payload),
    },
  );

  return data;
}

// Records a visitor arrival from an affiliate share link. The server decides
// whether an attribution can be established at all (it needs a known product and
// an authenticated customer) and keeps the first valid attribution forever, so
// this is safe to call on every arrival and its result is not acted upon.
export async function trackAffiliateVisit(payload: {
  code: string;
  productId?: string | null;
}): Promise<void> {
  await apiRequest<unknown>(`${AFFILIATE_ENDPOINT}/visit`, {
    method: "POST",
    body: JSON.stringify(payload),
  });
}
