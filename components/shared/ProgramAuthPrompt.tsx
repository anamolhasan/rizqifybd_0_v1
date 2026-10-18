"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useTranslations } from "next-intl";
import { LogIn, UserPlus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

// Shown on the public programme pages (referral / agent / affiliate) when the
// visitor is not signed in. Those forms post to authenticated endpoints, so the
// visitor is invited to log in or register and is returned to this page after.
export function ProgramAuthPrompt() {
  const t = useTranslations("common");
  const pathname = usePathname();
  const redirect = encodeURIComponent(pathname && pathname !== "/" ? pathname : "/");

  return (
    <Card className="relative isolate overflow-hidden rounded-2xl border border-white/80 bg-white/55 shadow-lg shadow-primary/[0.04] ring-0 backdrop-blur-xl sm:rounded-3xl">
      <CardHeader className="gap-2">
        <CardTitle className="text-lg font-bold tracking-tight">
          {t("loginToApply")}
        </CardTitle>
        <CardDescription>{t("loginToApplyDescription")}</CardDescription>
      </CardHeader>
      <CardContent className="flex flex-col gap-3 sm:flex-row">
        <Button asChild className="h-11 rounded-xl sm:flex-1">
          <Link href={`/login?redirect=${redirect}`}>
            <LogIn />
            {t("signIn")}
          </Link>
        </Button>
        <Button asChild variant="outline" className="h-11 rounded-xl sm:flex-1">
          <Link href={`/sign-up?redirect=${redirect}`}>
            <UserPlus />
            {t("signUp")}
          </Link>
        </Button>
      </CardContent>
    </Card>
  );
}
