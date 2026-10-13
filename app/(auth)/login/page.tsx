import type { Metadata } from "next";
import { getTranslations } from "next-intl/server";

import { LoginForm } from "@/components/shared/forms/LoginForm";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.login");
  return {
    title: t("title"),
    description: t("description"),
  };
}

interface LoginPageProps {
  searchParams: Promise<{ redirect?: string }>;
}

export default async function LoginPage({ searchParams }: LoginPageProps) {
  const params = await searchParams;
  const redirectPath =
    typeof params.redirect === "string" ? params.redirect : undefined;

  return <LoginForm redirectPath={redirectPath} />;
}
