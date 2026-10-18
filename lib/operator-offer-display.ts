import {
  Layers3,
  MessageSquareText,
  Package,
  PhoneCall,
  Wifi,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";

import type {
  IOperatorOffer,
  OperatorOfferType,
} from "@/types/operator-offer.types";

// Shared, presentation-only helpers for operator offer cards. Kept free of React
// so both the landing section and the public catalogue can reuse them.

export const OFFER_TYPE_ICONS: Record<OperatorOfferType, LucideIcon> = {
  MB: Wifi,
  MINUTE: PhoneCall,
  SMS: MessageSquareText,
  BUNDLE: Layers3,
  COMBO: Layers3,
  OTHER: Package,
};

// Operators have no guaranteed logo asset in the catalogue, so identity is
// conveyed with an accent colour plus the operator code. The colour is derived
// deterministically so a given operator stays consistent between renders.
export const OPERATOR_ACCENTS = [
  "#0f766e",
  "#0369a1",
  "#7c3aed",
  "#b45309",
  "#be123c",
  "#15803d",
  "#c2410c",
  "#0e7490",
];

export function accentForOperator(key: string): string {
  let hash = 0;
  for (let index = 0; index < key.length; index += 1) {
    hash = (hash * 31 + key.charCodeAt(index)) >>> 0;
  }
  return OPERATOR_ACCENTS[hash % OPERATOR_ACCENTS.length];
}

// Snapshot the load time once at module scope. Evaluating each offer's
// availability window against a stable timestamp keeps the render pure (no
// Date.now() during render) while still hiding offers scheduled for the future
// or already ended.
export const REFERENCE_NOW = Date.now();

type OfferWindow = Pick<IOperatorOffer, "startsAt" | "endsAt">;

export function isOfferCurrentlyAvailable(
  offer: OfferWindow,
  now: number = REFERENCE_NOW,
): boolean {
  const startsAt = offer.startsAt ? new Date(offer.startsAt).getTime() : NaN;
  const endsAt = offer.endsAt ? new Date(offer.endsAt).getTime() : NaN;

  if (!Number.isNaN(startsAt) && startsAt > now) return false;
  if (!Number.isNaN(endsAt) && endsAt < now) return false;

  return true;
}
