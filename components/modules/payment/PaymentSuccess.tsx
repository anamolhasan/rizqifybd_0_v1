"use client";

import Link from "next/link";
import { CheckCircle2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MY_ORDERS_ROUTE } from "@/lib/constants";

interface PaymentSuccessProps {
  sessionId: string | null;
}

export function PaymentSuccess({ sessionId }: PaymentSuccessProps) {
  const t = useTranslations("orders.payment.success");

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-12 sm:px-6 lg:py-16">
      <Card className="w-full rounded-xl border-emerald-200 bg-emerald-50/60 text-emerald-900">
        <CardContent className="flex flex-col items-center gap-4 px-6 py-10 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-white/70">
            <CheckCircle2 className="size-7" aria-hidden="true" />
          </span>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-sm text-emerald-800/80">{t("description")}</p>
          </div>
          {sessionId ? (
            <p className="font-mono text-xs break-all text-emerald-800/70">
              {t("reference")}: {sessionId}
            </p>
          ) : null}
          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            <Button asChild>
              <Link href={MY_ORDERS_ROUTE}>{t("viewOrders")}</Link>
            </Button>
            <Button asChild variant="outline">
              <Link href="/">{t("backHome")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
