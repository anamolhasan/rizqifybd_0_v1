import type { Metadata } from "next";
import Link from "next/link";
import { getTranslations } from "next-intl/server";

import { Button } from "@/components/ui/button";

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.forgotPassword");
  return {
    title: t("title"),
    description: t("description"),
  };
}

export default async function ForgotPasswordPage() {
  const t = await getTranslations("auth");

  return (
    <div className="mx-auto w-full max-w-md space-y-4 text-center">
      <h1 className="font-heading text-3xl font-extrabold">
        {t("forgotPasswordHeading")}
      </h1>
      <p className="text-sm leading-6 text-muted-foreground">
        {t("forgotPasswordBody")}
      </p>
      <Button asChild variant="outline" className="rounded-xl">
        <Link href="/login">{t("backToLogin")}</Link>
      </Button>
    </div>
  );
}
