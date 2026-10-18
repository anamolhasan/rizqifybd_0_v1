"use client";

import { useMemo } from "react";
import Link from "next/link";
import {
  AlertCircle,
  ArrowRight,
  Package,
  RefreshCcw,
  Sparkles,
} from "lucide-react";
import { useTranslations } from "next-intl";

import {
  OperatorOfferCard,
  OperatorOfferCardSkeleton,
} from "@/components/offers/OperatorOfferCard";
import { SERVICES_ROUTE } from "@/components/shared/navbar/nav-config";
import {
  Alert,
  AlertAction,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { useOperatorOffers } from "@/hooks/use-operator-offers";
import { isOfferCurrentlyAvailable, REFERENCE_NOW } from "@/lib/operator-offer-display";
import type { IOperatorOfferListParams } from "@/types/operator-offer.types";

// The desktop layout is a fixed 2 x 4 grid.
const VISIBLE_OFFER_COUNT = 8;
// Fetch a slightly larger page so offers dropped by the client-side
// availability window can still leave a full grid behind.
const OFFER_POOL_LIMIT = 24;

export default function OperatorOffersSection() {
  const t = useTranslations("offers");

  const listParams = useMemo<IOperatorOfferListParams>(
    () => ({
      page: 1,
      limit: OFFER_POOL_LIMIT,
      status: "ACTIVE",
      isActive: true,
      isDeleted: false,
      sortBy: "createdAt",
      sortOrder: "desc",
    }),
    [],
  );

  const { data, isLoading, isError, error, refetch, isFetching } =
    useOperatorOffers(listParams);

  const offers = useMemo(() => {
    const rows = data?.data ?? [];

    return rows
      .filter(
        (offer) =>
          offer.status === "ACTIVE" &&
          offer.isActive &&
          !offer.isDeleted &&
          isOfferCurrentlyAvailable(offer, REFERENCE_NOW),
      )
      .slice(0, VISIBLE_OFFER_COUNT);
  }, [data]);

  const gridClassName =
    "mt-12 grid grid-cols-2 gap-3 sm:gap-4 md:grid-cols-3 lg:grid-cols-4 lg:gap-6";

  return (
    <section
      id="offers"
      className="relative isolate overflow-hidden bg-muted/30 py-16 sm:py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-105 -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 -z-10 size-96 rounded-full bg-teal-200/25 blur-[110px]"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/60 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur-xl">
            <Sparkles className="size-4" aria-hidden="true" />
            {t("badge")}
          </div>

          <h2 className="mt-6 text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t("title")}
            <span className="mt-2 block bg-linear-to-r from-primary via-emerald-600 to-teal-500 bg-clip-text text-transparent">
              {t("titleAccent")}
            </span>
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            {t("subtitle")}
          </p>
        </div>

        {isLoading ? (
          <div className={gridClassName} aria-busy="true" aria-label={t("loading")}>
            {Array.from({ length: VISIBLE_OFFER_COUNT }, (_, index) => (
              <OperatorOfferCardSkeleton key={index} />
            ))}
          </div>
        ) : isError ? (
          <Alert variant="destructive" className="mx-auto mt-12 max-w-xl">
            <AlertCircle />
            <AlertTitle>{t("errorTitle")}</AlertTitle>
            <AlertDescription>
              {error?.message ?? t("errorDescription")}
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
        ) : offers.length === 0 ? (
          <Card className="mx-auto mt-12 flex max-w-xl flex-col items-center gap-3 rounded-3xl border border-dashed border-primary/30 bg-primary/4 px-6 py-12 text-center shadow-sm">
            <span className="grid size-12 place-items-center rounded-2xl bg-primary/10 text-primary">
              <Package className="size-6" aria-hidden="true" />
            </span>
            <h3 className="text-lg font-bold tracking-tight text-foreground">
              {t("emptyTitle")}
            </h3>
            <p className="max-w-md text-sm leading-6 text-muted-foreground">
              {t("emptyDescription")}
            </p>
            <Button asChild className="mt-1">
              <Link href={SERVICES_ROUTE}>
                {t("viewAll")}
                <ArrowRight className="size-4" aria-hidden="true" />
              </Link>
            </Button>
          </Card>
        ) : (
          <>
            <div className={gridClassName}>
              {offers.map((offer) => (
                <OperatorOfferCard key={offer.id} offer={offer} />
              ))}
            </div>

            <div className="mt-10 flex justify-center sm:mt-12">
              <Button
                asChild
                size="lg"
                className="glow-cy h-11 px-6 font-heading font-extrabold"
              >
                <Link href={SERVICES_ROUTE}>
                  {t("viewAll")}
                  <ArrowRight className="size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
