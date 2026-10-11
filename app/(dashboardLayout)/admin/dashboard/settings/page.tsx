import type { Metadata } from "next";

import { ReferralDefaultSetting } from "@/components/modules/settings/ReferralDefaultSetting";

export const metadata: Metadata = {
  title: "Settings",
  description: "Manage system-wide settings for the RizqifyBD admin panel.",
};

export default function SettingsPage() {
  return <ReferralDefaultSetting />;
}