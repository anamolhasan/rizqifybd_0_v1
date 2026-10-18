"use client";

import { Suspense, useEffect, useRef } from "react";
import { useSearchParams } from "next/navigation";

import { trackAffiliateVisit } from "@/lib/affiliate-program-api";

// First-touch affiliate attribution. When a visitor arrives through an affiliate
// share link (`?aff=CODE`, and optionally `?product=ID` for a campaign link that
// is not bound to a single product) this records the visit.
//
// The rules that matter are all enforced server-side:
//   • only an authenticated visitor can be attributed (anonymous arrivals are a
//     no-op, not an error);
//   • a product must be known, otherwise nothing is recorded;
//   • the FIRST valid attribution per customer+product is permanent and is never
//     replaced by a later visit.
// So this fires once per arrival, ignores every failure, and never renders.
function AffiliateVisitTrackerInner() {
  const searchParams = useSearchParams();
  const code = searchParams.get("aff");
  const productId = searchParams.get("product") ?? null;
  const sent = useRef(false);

  useEffect(() => {
    if (!code || sent.current) {
      return;
    }

    sent.current = true;

    void trackAffiliateVisit({ code, productId }).catch(() => undefined);
  }, [code, productId]);

  return null;
}

export function AffiliateVisitTracker() {
  // `useSearchParams` needs a Suspense boundary so the layout can still be
  // prerendered.
  return (
    <Suspense fallback={null}>
      <AffiliateVisitTrackerInner />
    </Suspense>
  );
}
