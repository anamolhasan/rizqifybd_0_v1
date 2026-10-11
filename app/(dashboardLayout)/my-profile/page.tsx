import type { Metadata } from "next";

import { MyProfile } from "@/components/modules/profile/MyProfile";

export const metadata: Metadata = {
  title: "My Profile",
  description: "View and manage your RizqifyBD account profile.",
};

export default function MyProfilePage() {
  return <MyProfile />;
}
