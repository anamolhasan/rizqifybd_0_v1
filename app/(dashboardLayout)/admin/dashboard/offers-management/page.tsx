import type { Metadata } from "next";

import { OfferManagement } from "@/components/modules/offers/OfferManagement";

export const metadata: Metadata = {
  title: "Offers Management",
  description: "Manage RizqifyBD telecom offers.",
};

export default function OffersManagementPage() {
  return <OfferManagement />;
}
