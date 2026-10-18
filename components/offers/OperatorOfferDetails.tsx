"use client";

import { useMemo } from "react";
import Link from "next/link";
import { notFound } from "next/navigation";
import {
  AlertCircle,
  ArrowLeft,
  CalendarClock,
  Layers3,
  MessageSquareText,
  Package,
  PhoneCall,
  RefreshCcw,
  Sparkles,
  Wifi,
} from "lucide-react";
import { useTranslations } from "next-intl";

import { SERVICES_ROUTE } from "@/components/shared/navbar/nav-config";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { useOperatorOfferById } from "@/hooks/use-operator-offers";
import { formatBDT, formatDateTime, formatNumber } from "@/lib/format";
import { accentForOperator, REFERENCE_NOW, isOfferCurrentlyAvailable } from "@/lib/operator-offer-display";
import { OrderConfirmationDialog } from "@/components/offers/OrderConfirmationDialog";
import type { OperatorOfferType } from "@/types/operator-offer.types";

const ICONS: Record<OperatorOfferType, typeof Wifi> = {
  MB: Wifi,
  MINUTE: PhoneCall,
  SMS: MessageSquareText,
  BUNDLE: Layers3,
  COMBO: Layers3,
  OTHER: Package,
};

interface OperatorOfferDetailsProps {
  offerId: string;
}

export default function OperatorOfferDetails({
  offerId,
}: OperatorOfferDetailsProps) {
  const t = useTranslations("offers");
  const tEnums = useTranslations("enums");

  const { data: offer, isLoading, isError, error, refetch, isFetching } =
    useOperatorOfferById(offerId);

  const operatorName = offer?.operator?.name ?? t("unknownOperator");
  const operatorCode =
    offer?.operator?.code ?? operatorName.slice(0, 2).toUpperCase();
  const accent = useMemo(
    () =>
      accentForOperator(
        offer?.operator?.code ?? offer?.operator?.name ?? offer?.id ?? offerId,
      ),
    [offer, offerId],
  );
  const Icon = offer ? ICONS[offer.offerType] ?? Package : Package;

  const benefit = useMemo(() => {
    if (!offer) return "";
    return offer.amount !== null && offer.amountUnit
      ? `${formatNumber(offer.amount)} ${tEnums(`amountUnit.${offer.amountUnit}`)}`
      : tEnums(`offerType.${offer.offerType}`);
  }, [offer, tEnums]);

  const validity = useMemo(() => {
    if (!offer) return null;
    if (offer.validityValue === null || !offer.validityUnit) return null;
    return `${formatNumber(offer.validityValue)} ${tEnums(
      `validityUnit.${offer.validityUnit}`,
    )}`;
  }, [offer, tEnums]);

  const hasDiscount = useMemo(() => {
    if (!offer) return false;
    return (
      offer.discountType !== "NONE" &&
      offer.discountValue > 0 &&
      offer.regularPrice > offer.price
    );
  }, [offer]);

  const discountLabel = useMemo(() => {
    if (!offer) return null;
    if (!hasDiscount) return null;
    return offer.discountType === "PERCENTAGE"
      ? `-${formatNumber(offer.discountValue)}%`
      : `-${formatBDT(offer.discountValue)}`;
  }, [offer, hasDiscount]);

  const startsAt = offer?.startsAt ? formatDateTime(offer.startsAt) : null;
  const endsAt = offer?.endsAt ? formatDateTime(offer.endsAt) : null;

  const isAvailableWindow = useMemo(() => {
    if (!offer) return false;
    return isOfferCurrentlyAvailable(offer, REFERENCE_NOW);
  }, [offer]);

  const isEligible = useMemo(() => {
    if (!offer) return false;
    if (offer.isDeleted) return false;
    if (!offer.isActive) return false;
    if (offer.status !== "ACTIVE") return false;
    return isAvailableWindow;
  }, [offer, isAvailableWindow]);

  if (isLoading) {
    return (
      <div className="relative isolate min-h-screen bg-muted/30">
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col gap-6 px-4 py-10 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between gap-3">
            <Skeleton className="h-9 w-40 rounded-full" />
            <Skeleton className="h-9 w-28 rounded-full" />
          </div>
          <Card className="overflow-hidden rounded-3xl">
            <Skeleton className="h-2 w-full" />
            <CardContent className="grid gap-6 p-6 sm:grid-cols-2 sm:p-10">
              <div className="space-y-4">
                <Skeleton className="h-6 w-24" />
                <Skeleton className="h-10 w-2/3" />
                <div className="flex gap-2">
                  <Skeleton className="h-5 w-16" />
                  <Skeleton className="h-5 w-20" />
                </div>
              </div>
              <div className="space-y-4">
                <Skeleton className="h-20 w-full" />
                <Skeleton className="h-10 w-full" />
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="relative isolate min-h-screen bg-muted/30">
        <div className="mx-auto flex min-h-screen w-full max-w-5xl flex-col justify-center gap-6 px-4 py-10 sm:px-6 lg:px-8">
          <Alert variant="destructive" className="mx-auto max-w-xl">
            <AlertCircle />
            <AlertTitle>{t("errorLoadingOfferTitle")}</AlertTitle>
            <AlertDescription>
              {error?.message ?? t("errorLoadingOfferDescription")}
            </AlertDescription>
            <AlertAction>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCcw />
                {t("retry")}
              </Button>
            </AlertAction>
          </Alert>
          <div className="flex justify-center">
            <Button asChild variant="ghost">
              <Link href={SERVICES_ROUTE}>
                <ArrowLeft className="size-4" />
                {t("backToOffers")}
              </Link>
            </Button>
          </div>
        </div>
      </div>
    );
  }

  if (!offer) {
    notFound();
    return null;
  }

  if (offer.isDeleted) {
    notFound();
    return null;
  }

  const windowInvalid = !isAvailableWindow;

  return (
    <div className="relative isolate min-h-screen bg-muted/30">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute inset-0 -z-10 overflow-x-clip"
      >
        <div className="absolute -top-32 left-1/2 size-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]" />
        <div className="absolute -right-40 top-60 size-96 rounded-full bg-teal-200/25 blur-[110px]" />
      </div>

      <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6 lg:px-8">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <Button asChild variant="ghost" size="sm">
            <Link href={SERVICES_ROUTE}>
              <ArrowLeft className="size-4" />
              {t("backToOffers")}
            </Link>
          </Button>
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-1.5 text-xs font-semibold text-primary shadow-sm backdrop-blur-xl">
            <Sparkles className="size-3.5" aria-hidden="true" />
            {t("detailsTitle")}
          </div>
        </div>

        {windowInvalid && (
          <Alert className="mt-6 border-amber-200 bg-amber-50/80 text-amber-900">
            <AlertCircle className="text-amber-700" />
            <AlertTitle>{t("offerUnavailableTitle")}</AlertTitle>
            <AlertDescription>
              {t("offerUnavailableDescription")}
            </AlertDescription>
          </Alert>
        )}

        <Card className="mt-6 overflow-hidden rounded-3xl border border-white/80 bg-white/70 shadow-xl shadow-primary/5 backdrop-blur-xl">
          <div
            aria-hidden="true"
            className="h-2 w-full"
            style={{ backgroundColor: accent }}
          />
          <CardHeader className="flex flex-col gap-4 p-6 sm:flex-row sm:items-start sm:justify-between sm:p-10">
            <div className="flex items-start gap-4">
              <span
                aria-hidden="true"
                className="grid size-12 shrink-0 place-items-center rounded-2xl text-sm font-extrabold text-white shadow-sm"
                style={{ backgroundColor: accent }}
              >
                {operatorCode}
              </span>
              <div className="space-y-2">
                <p className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                  {operatorName}
                </p>
                <CardTitle className="text-2xl leading-tight font-bold tracking-tight sm:text-3xl lg:text-4xl">
                  {offer.name}
                </CardTitle>
                <div className="flex flex-wrap items-center gap-2">
                  <Badge variant="secondary" className="rounded-full">
                    {tEnums(`offerType.${offer.offerType}`)}
                  </Badge>
                  {offer.badges.map((badge) => (
                    <Badge
                      key={badge}
                      variant="outline"
                      className="rounded-full border-primary/30 bg-primary/[0.06] text-primary"
                    >
                      {tEnums(`offerBadge.${badge}`)}
                    </Badge>
                  ))}
                  {offer.status !== "ACTIVE" && (
                    <Badge variant="outline" className="rounded-full">
                      {tEnums(`offerStatus.${offer.status}`)}
                    </Badge>
                  )}
                </div>
              </div>
            </div>

            <div className="flex flex-col items-start gap-3 sm:items-end">
              <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                <span className="text-3xl font-extrabold tracking-tight text-primary sm:text-4xl">
                  {formatBDT(offer.price)}
                </span>
                {hasDiscount && (
                  <span className="text-base font-medium text-muted-foreground line-through">
                    {formatBDT(offer.regularPrice)}
                  </span>
                )}
                {discountLabel && (
                  <Badge
                    variant="secondary"
                    className="rounded-full bg-destructive/10 text-xs font-bold text-destructive"
                  >
                    {discountLabel}
                  </Badge>
                )}
              </div>
              {validity && (
                <p className="flex items-center gap-2 text-sm text-muted-foreground">
                  <CalendarClock className="size-4" aria-hidden="true" />
                  {t("validity")}: {validity}
                </p>
              )}
            </div>
          </CardHeader>

          <CardContent className="grid gap-8 p-6 sm:p-10 lg:grid-cols-2">
            <div className="space-y-6">
              <div className="rounded-2xl border border-border/60 bg-background/70 p-6">
                <h2 className="text-lg font-semibold">{t("benefit")}</h2>
                <div className="mt-4 flex items-center gap-3">
                  <span className="grid size-10 shrink-0 place-items-center rounded-xl bg-primary/10 text-primary">
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                  <p className="text-xl font-extrabold tracking-tight text-foreground">
                    {benefit}
                  </p>
                </div>
                {offer.description && (
                  <p className="mt-4 text-sm leading-6 text-muted-foreground">
                    {offer.description}
                  </p>
                )}
              </div>

              <div className="grid gap-4 sm:grid-cols-2">
                <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("regularPrice")}
                  </h3>
                  <p className="mt-2 text-lg font-bold text-foreground">
                    {formatBDT(offer.regularPrice)}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-5">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("sellingPrice")}
                  </h3>
                  <p className="mt-2 text-lg font-bold text-primary">
                    {formatBDT(offer.price)}
                  </p>
                </div>
                <div className="rounded-2xl border border-border/60 bg-background/70 p-5 sm:col-span-2">
                  <h3 className="text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                    {t("category")}
                  </h3>
                  <p className="mt-2 text-base font-medium text-foreground">
                    {tEnums(`offerType.${offer.offerType}`)}
                  </p>
                </div>
              </div>
            </div>

            <div className="space-y-6">
              <div className="rounded-2xl border border-border/60 bg-background/70 p-6">
                <h2 className="text-lg font-semibold">{t("availability")}</h2>
                <div className="mt-4 space-y-3 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("startsAt")}</span>
                    <span className="font-medium text-foreground">
                      {startsAt ?? t("alwaysAvailable")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("endsAt")}</span>
                    <span className="font-medium text-foreground">
                      {endsAt ?? t("alwaysAvailable")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-muted-foreground">{t("status")}</span>
                    <span className="font-medium text-foreground">
                      {tEnums(`offerStatus.${offer.status}`)}
                    </span>
                  </div>
                  {offer.badges.length > 0 && (
                    <div className="flex items-center justify-between">
                      <span className="text-muted-foreground">{t("badges")}</span>
                      <div className="flex flex-wrap justify-end gap-2">
                        {offer.badges.map((badge) => (
                          <Badge
                            key={badge}
                            variant="outline"
                            className="rounded-full"
                          >
                            {tEnums(`offerBadge.${badge}`)}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>

              <div className="rounded-2xl border border-border/60 bg-background/70 p-6">
                <h2 className="text-lg font-semibold">
                  {t("regionalEligibility")}
                </h2>
                <p className="mt-2 text-sm leading-6 text-muted-foreground">
                  {t("regionalEligibilityUnknown")}
                </p>
              </div>

              {offer.description && (
                <div className="rounded-2xl border border-border/60 bg-background/70 p-6">
                  <h2 className="text-lg font-semibold">{t("terms")}</h2>
                  <p className="mt-2 text-sm leading-6 text-muted-foreground whitespace-pre-line">
                    {offer.description}
                  </p>
                </div>
              )}

              <div className="flex flex-col gap-3 sm:flex-row">
                <OrderConfirmationDialog
                  offer={offer}
                  trigger={
                    <Button
                      type="button"
                      size="lg"
                      className="glow-cy h-11 flex-1 font-heading font-extrabold"
                      disabled={!isEligible}
                    >
                      {t("buyNow")}
                    </Button>
                  }
                />
                <Button asChild size="lg" variant="outline" className="h-11 flex-1">
                  <Link href={SERVICES_ROUTE}>{t("viewAllOffers")}</Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
