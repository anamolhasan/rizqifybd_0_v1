import type { Metadata } from "next";

import { ChangePassword } from "@/components/modules/change-password/ChangePassword";

export const metadata: Metadata = {
  title: "Change Password",
  description: "Update your RizqifyBD account password.",
};

export default function ChangePasswordPage() {
  return <ChangePassword />;
}
