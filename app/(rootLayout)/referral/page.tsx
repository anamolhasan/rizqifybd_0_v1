import type { Metadata } from "next";

import { ReferralProgram } from "@/components/modules/referral/ReferralProgram";

export const metadata: Metadata = {
  title: "রেফারেল প্রোগ্রাম",
  description:
    "RizqifyBD রেফারেল প্রোগ্রামে যোগ দিন। আপনার পরিচিতদের যুক্ত করুন এবং প্রতিটি সফল রেফারেলে আয় করুন।",
};

export default function ReferralPage() {
  return <ReferralProgram />;
}
