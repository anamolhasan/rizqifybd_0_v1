import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { MyProfile } from "@/components/modules/profile/MyProfile";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata");
  return {
    title: t("myProfile.title"),
    description: t("myProfile.description"),
  };
}

export default function MyProfilePage() {
  return <MyProfile />;
}
