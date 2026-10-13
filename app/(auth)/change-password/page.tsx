import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { ChangePassword } from "@/components/modules/change-password/ChangePassword";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.changePassword");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default function ChangePasswordPage() {
  return <ChangePassword />;
}
