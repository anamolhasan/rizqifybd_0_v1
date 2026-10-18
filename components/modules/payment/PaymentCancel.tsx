"use client";

import Link from "next/link";
import { XCircle } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { MY_ORDERS_ROUTE } from "@/lib/constants";

interface PaymentCancelProps {
  orderId: string | null;
}

export function PaymentCancel({ orderId }: PaymentCancelProps) {
  const t = useTranslations("orders.payment.cancel");

  const orderHref = orderId
    ? `${MY_ORDERS_ROUTE}/${encodeURIComponent(orderId)}`
    : null;

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-3xl items-center px-4 py-12 sm:px-6 lg:py-16">
      <Card className="w-full rounded-xl border-amber-200 bg-amber-50/60 text-amber-900">
        <CardContent className="flex flex-col items-center gap-4 px-6 py-10 text-center">
          <span className="grid size-14 place-items-center rounded-full bg-white/70">
            <XCircle className="size-7" aria-hidden="true" />
          </span>
          <div className="space-y-2">
            <h1 className="text-2xl font-bold tracking-tight">{t("title")}</h1>
            <p className="text-sm text-amber-800/80">{t("description")}</p>
          </div>
          <div className="flex flex-col gap-2 pt-2 sm:flex-row">
            {orderHref ? (
              <Button asChild>
                <Link href={orderHref}>{t("viewOrder")}</Link>
              </Button>
            ) : null}
            <Button asChild variant={orderHref ? "outline" : "default"}>
              <Link href={MY_ORDERS_ROUTE}>{t("viewOrders")}</Link>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
