import type { Metadata } from "next";

import { ReferralApplicationsManagement } from "@/components/modules/referral-applications/ReferralApplicationsManagement";

export const metadata: Metadata = {
  title: "Referral Applications Management",
  description: "Review and manage user referral income applications.",
};

export default function ReferralApplicationsManagementPage() {
  return <ReferralApplicationsManagement />;
}
