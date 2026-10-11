import type { Metadata } from "next";

import { OperatorManagement } from "@/components/modules/operators/OperatorManagement";

export const metadata: Metadata = {
  title: "Operators Management",
  description: "Manage RizqifyBD mobile operators.",
};

export default function OperatorsManagementPage() {
  return <OperatorManagement />;
}
