"use client";

import Link from "next/link";
import {
  ArrowRight,
  CalendarClock,
  Package,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { OFFER_DETAILS_ROUTE } from "@/components/shared/navbar/nav-config";
import { Badge } from "@/components/ui/badge";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import {
  accentForOperator,
  OFFER_TYPE_ICONS,
} from "@/lib/operator-offer-display";
import { formatBDT, formatNumber } from "@/lib/format";
import type { IOperatorOffer } from "@/types/operator-offer.types";

export function OperatorOfferCard({ offer }: { offer: IOperatorOffer }) {
  const t = useTranslations("offers");
  const tEnums = useTranslations("enums");

  const operatorName = offer.operator?.name ?? t("unknownOperator");
  const operatorCode =
    offer.operator?.code ?? operatorName.slice(0, 2).toUpperCase();
  const accent = accentForOperator(
    offer.operator?.code ?? offer.operator?.name ?? offer.id,
  );
  const Icon = OFFER_TYPE_ICONS[offer.offerType] ?? Package;

  const benefit =
    offer.amount !== null && offer.amountUnit
      ? `${formatNumber(offer.amount)} ${tEnums(`amountUnit.${offer.amountUnit}`)}`
      : tEnums(`offerType.${offer.offerType}`);

  const validity =
    offer.validityValue !== null && offer.validityUnit
      ? `${formatNumber(offer.validityValue)} ${tEnums(
          `validityUnit.${offer.validityUnit}`,
        )}`
      : null;

  const hasDiscount =
    offer.discountType !== "NONE" &&
    offer.discountValue > 0 &&
    offer.regularPrice > offer.price;

  const discountLabel =
    offer.discountType === "PERCENTAGE"
      ? `-${formatNumber(offer.discountValue)}%`
      : `-${formatBDT(offer.discountValue)}`;

  return (
    <Link
      href={OFFER_DETAILS_ROUTE(offer.id)}
      aria-label={`${offer.name} — ${t("viewOffer")}`}
      className="group block h-full rounded-2xl outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
    >
      <Card
        size="sm"
        className="relative flex h-full flex-col gap-0 overflow-hidden rounded-2xl border border-white/80 bg-white/60 p-0 shadow-lg shadow-primary/5 backdrop-blur-xl transition-all duration-300 group-hover:-translate-y-1.5 group-hover:border-primary/25 group-hover:shadow-xl group-hover:shadow-primary/10 motion-reduce:transition-none motion-reduce:group-hover:translate-y-0"
      >
        <div
          aria-hidden="true"
          className="h-1.5 w-full opacity-80"
          style={{ backgroundColor: accent }}
        />

        <div className="flex items-center justify-between gap-2 px-4 pt-3.5">
          <div className="flex min-w-0 items-center gap-2">
            <span
              aria-hidden="true"
              className="grid size-8 shrink-0 place-items-center rounded-lg text-[11px] font-extrabold text-white shadow-sm"
              style={{ backgroundColor: accent }}
            >
              {operatorCode}
            </span>
            <span className="truncate text-[11px] font-semibold tracking-wide text-muted-foreground uppercase">
              {operatorName}
            </span>
          </div>

          {hasDiscount ? (
            <Badge
              variant="secondary"
              className="h-5 shrink-0 rounded-full bg-destructive/10 px-2 text-[10px] font-bold text-destructive"
            >
              {discountLabel}
            </Badge>
          ) : null}
        </div>

        <div className="flex flex-1 flex-col gap-2 px-4 pt-3">
          <div className="flex items-center gap-2">
            <span className="grid size-8 shrink-0 place-items-center rounded-lg bg-primary/10 text-primary">
              <Icon className="size-4" aria-hidden="true" />
            </span>
            <p className="text-xl leading-none font-extrabold tracking-tight text-foreground">
              {benefit}
            </p>
          </div>

          <p className="line-clamp-1 text-xs font-medium text-muted-foreground">
            {offer.name}
          </p>

          <div className="mt-1 flex flex-wrap items-center gap-1.5">
            <Badge
              variant="secondary"
              className="h-5 rounded-full px-2 text-[10px] font-semibold"
            >
              {tEnums(`offerType.${offer.offerType}`)}
            </Badge>
            {offer.badges.slice(0, 2).map((badge) => (
              <Badge
                key={badge}
                variant="outline"
                className="h-5 rounded-full border-primary/25 bg-primary/6 px-2 text-[10px] font-semibold text-primary"
              >
                {tEnums(`offerBadge.${badge}`)}
              </Badge>
            ))}
          </div>
        </div>

        <div className="mt-auto flex items-end justify-between gap-2 px-4 pt-3 pb-4">
          <div className="min-w-0">
            <div className="flex flex-wrap items-baseline gap-x-1.5">
              <span className="text-base font-extrabold tracking-tight text-primary">
                {formatBDT(offer.price)}
              </span>
              {hasDiscount ? (
                <span className="text-[11px] font-medium text-muted-foreground line-through">
                  {formatBDT(offer.regularPrice)}
                </span>
              ) : null}
            </div>
            {validity ? (
              <p className="mt-0.5 flex items-center gap-1 text-[11px] text-muted-foreground">
                <CalendarClock className="size-3" aria-hidden="true" />
                {validity}
              </p>
            ) : null}
          </div>

          <span
            aria-hidden="true"
            className="grid size-7 shrink-0 place-items-center rounded-full border border-primary/15 bg-white/70 text-primary transition-all duration-300 group-hover:border-primary group-hover:bg-primary group-hover:text-primary-foreground"
          >
            <ArrowRight className="size-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
          </span>
        </div>
      </Card>
    </Link>
  );
}

export function OperatorOfferCardSkeleton() {
  return (
    <Card
      size="sm"
      className="flex h-full flex-col gap-0 overflow-hidden rounded-2xl border border-white/80 bg-white/60 p-0 shadow-lg shadow-primary/5 backdrop-blur-xl"
    >
      <Skeleton className="h-1.5 w-full rounded-none" />
      <div className="flex items-center gap-2 px-4 pt-3.5">
        <Skeleton className="size-8 shrink-0 rounded-lg" />
        <Skeleton className="h-3 w-2/3" />
      </div>
      <div className="flex flex-1 flex-col gap-2 px-4 pt-3">
        <div className="flex items-center gap-2">
          <Skeleton className="size-8 shrink-0 rounded-lg" />
          <Skeleton className="h-6 w-24" />
        </div>
        <Skeleton className="h-3 w-1/2" />
        <Skeleton className="h-5 w-20 rounded-full" />
      </div>
      <div className="flex items-end justify-between gap-2 px-4 pt-3 pb-4">
        <div className="space-y-1.5">
          <Skeleton className="h-5 w-20" />
          <Skeleton className="h-3 w-16" />
        </div>
        <Skeleton className="size-7 rounded-full" />
      </div>
    </Card>
  );
}
