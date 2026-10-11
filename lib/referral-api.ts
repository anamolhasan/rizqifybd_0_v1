import { apiRequest } from "./api";

import type {
  IReferralApplication,
  IReferralMe,
  ISubmitReferralApplicationPayload,
} from "@/types/referral.types";

// The backend exposes the customer referral program at /api/v1/referral.
const REFERRAL_ENDPOINT = "/referral";

export async function getMyReferral(): Promise<IReferralMe> {
  const { data } = await apiRequest<IReferralMe>(`${REFERRAL_ENDPOINT}/me`, {
    method: "GET",
  });

  return data;
}

export async function applyForReferralIncome(
  payload: ISubmitReferralApplicationPayload,
): Promise<IReferralApplication> {
  const { data } = await apiRequest<IReferralApplication>(
    `${REFERRAL_ENDPOINT}/apply`,
    {
      method: "POST",
      body: JSON.stringify(payload),
    },
  );

  return data;
}
