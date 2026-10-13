import type { Metadata } from "next";

import { AddOfferForm } from "@/components/modules/offers/AddOfferForm";

export const metadata: Metadata = {
  title: "Add Offer | RizqifyBD",
  description: "Create a new telecom offer for your catalogue.",
};

export default function AddOfferPage() {
  return <AddOfferForm />;
}
