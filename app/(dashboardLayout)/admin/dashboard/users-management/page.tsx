import type { Metadata } from "next";

import { UserManagement } from "@/components/modules/users/UserManagement";

export const metadata: Metadata = {
  title: "Users Management",
  description: "Create and manage staff accounts for the RizqifyBD admin panel.",
};

export default function UsersManagementPage() {
  return <UserManagement />;
}