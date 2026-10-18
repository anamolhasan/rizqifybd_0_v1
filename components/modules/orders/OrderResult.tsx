"use client";

import Link from "next/link";
import {
  AlertCircle,
  ArrowLeft,
  CheckCircle2,
  Clock,
  Package,
  RefreshCcw,
  RotateCcw,
  XCircle,
} from "lucide-react";
import type { LucideIcon } from "lucide-react";
import { useTranslations } from "next-intl";

import { PageHeader } from "@/components/shared/PageHeader";
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
import { useMyOrder } from "@/hooks/use-orders";
import { ApiError } from "@/lib/api";
import { MY_ORDERS_ROUTE } from "@/lib/constants";
import { formatBDT, formatDateTime, formatNumber } from "@/lib/format";
import {
  resolveOrderResultState,
  type OrderResultState,
} from "@/lib/order-status";
import type { OrderStatus, PaymentStatus } from "@/types/enums";
import { cn } from "@/lib/utils";

const RESULT_ICONS: Record<OrderResultState, LucideIcon> = {
  pending: Clock,
  paid: CheckCircle2,
  fulfilled: Package,
  cancelled: XCircle,
  failed: AlertCircle,
  refunded: RotateCcw,
};

const RESULT_TONES: Record<OrderResultState, string> = {
  pending: "border-amber-200 bg-amber-50/80 text-amber-900",
  paid: "border-emerald-200 bg-emerald-50/80 text-emerald-900",
  fulfilled: "border-emerald-200 bg-emerald-50/80 text-emerald-900",
  cancelled: "border-border bg-muted/60 text-foreground",
  failed: "border-destructive/30 bg-destructive/5 text-destructive",
  refunded: "border-sky-200 bg-sky-50/80 text-sky-900",
};

function paymentBadgeVariant(status: PaymentStatus) {
  switch (status) {
    case "PAID":
      return "default" as const;
    case "REFUNDED":
      return "outline" as const;
    case "FAILED":
    case "CANCELLED":
      return "destructive" as const;
    case "PENDING":
    default:
      return "secondary" as const;
  }
}

interface DetailRowProps {
  label: string;
  value: React.ReactNode;
}

function DetailRow({ label, value }: DetailRowProps) {
  return (
    <div className="flex items-start justify-between gap-4 py-2">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-right text-sm font-medium text-foreground">
        {value}
      </span>
    </div>
  );
}

interface OrderResultProps {
  orderId: string;
}

export function OrderResult({ orderId }: OrderResultProps) {
  const t = useTranslations("dashboard.orders");
  const tc = useTranslations("common");

  const { data: order, isLoading, isError, error, refetch, isFetching } =
    useMyOrder(orderId);

  const notFound = error instanceof ApiError && error.status === 404;
  const forbidden =
    error instanceof ApiError &&
    (error.status === 403 || error.status === 401);

  const paymentStatusLabels: Record<PaymentStatus, string> = {
    PENDING: t("paymentStatuses.PENDING"),
    PAID: t("paymentStatuses.PAID"),
    FAILED: t("paymentStatuses.FAILED"),
    REFUNDED: t("paymentStatuses.REFUNDED"),
    CANCELLED: t("paymentStatuses.CANCELLED"),
  };

  const orderStatusLabels: Record<OrderStatus, string> = {
    PENDING: t("orderStatuses.PENDING"),
    PROCESSING: t("orderStatuses.PROCESSING"),
    WORKING: t("orderStatuses.WORKING"),
    COMPLETED: t("orderStatuses.COMPLETED"),
    CANCELLED: t("orderStatuses.CANCELLED"),
    FAILED: t("orderStatuses.FAILED"),
  };

  const resultText: Record<
    OrderResultState,
    { title: string; description: string }
  > = {
    pending: {
      title: t("status.pending.title"),
      description: t("status.pending.description"),
    },
    paid: {
      title: t("status.paid.title"),
      description: t("status.paid.description"),
    },
    fulfilled: {
      title: t("status.fulfilled.title"),
      description: t("status.fulfilled.description"),
    },
    cancelled: {
      title: t("status.cancelled.title"),
      description: t("status.cancelled.description"),
    },
    failed: {
      title: t("status.failed.title"),
      description: t("status.failed.description"),
    },
    refunded: {
      title: t("status.refunded.title"),
      description: t("status.refunded.description"),
    },
  };

  const header = (
    <PageHeader title={t("result.title")} description={t("result.description")}>
      <Button asChild variant="outline">
        <Link href={MY_ORDERS_ROUTE}>
          <ArrowLeft />
          {t("result.backToOrders")}
        </Link>
      </Button>
    </PageHeader>
  );

  if (isLoading) {
    return (
      <div className="mx-auto w-full max-w-5xl space-y-6">
        {header}
        <Skeleton className="h-24 w-full rounded-xl" />
        <div className="grid gap-6 lg:grid-cols-2">
          <Skeleton className="h-72 rounded-xl" />
          <Skeleton className="h-72 rounded-xl" />
        </div>
      </div>
    );
  }

  if (isError) {
    const hideRetry = notFound || forbidden;
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6">
        {header}
        <Alert variant="destructive">
          <AlertCircle />
          <AlertTitle>
            {hideRetry ? t("result.notFoundTitle") : t("result.loadFailedTitle")}
          </AlertTitle>
          <AlertDescription>
            {hideRetry
              ? t("result.notFoundDescription")
              : error instanceof Error
                ? error.message
                : tc("error")}
          </AlertDescription>
          {!hideRetry ? (
            <AlertAction>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => refetch()}
                disabled={isFetching}
              >
                <RefreshCcw />
                {tc("retry")}
              </Button>
            </AlertAction>
          ) : null}
        </Alert>
      </div>
    );
  }

  if (!order) {
    return (
      <div className="mx-auto w-full max-w-3xl space-y-6">
        {header}
        <Alert>
          <AlertCircle />
          <AlertTitle>{t("result.notFoundTitle")}</AlertTitle>
          <AlertDescription>{t("result.notFoundDescription")}</AlertDescription>
        </Alert>
      </div>
    );
  }

  const state = resolveOrderResultState(order.status, order.paymentStatus);
  const ResultIcon = RESULT_ICONS[state];
  const offer = order.operatorOffer;
  const operatorName = offer?.operator?.name;

  return (
    <div className="mx-auto w-full max-w-5xl space-y-6">
      {header}

      <Card className={cn("rounded-xl border", RESULT_TONES[state])}>
        <CardContent className="flex items-start gap-4 py-5">
          <span className="grid size-11 shrink-0 place-items-center rounded-full bg-white/60">
            <ResultIcon className="size-5" aria-hidden="true" />
          </span>
          <div className="space-y-1">
            <p className="text-base font-bold">{resultText[state].title}</p>
            <p className="text-sm">{resultText[state].description}</p>
          </div>
        </CardContent>
      </Card>

      <div className="grid gap-6 lg:grid-cols-2">
        <Card>
          <CardHeader>
            <CardTitle>{t("result.offer")}</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <DetailRow
              label={t("result.operator")}
              value={operatorName ?? t("result.notProvided")}
            />
            <DetailRow
              label={t("result.offer")}
              value={offer?.name ?? t("result.notProvided")}
            />
            <DetailRow
              label={t("result.quantity")}
              value={formatNumber(order.quantity)}
            />
            <DetailRow
              label={t("result.unitPrice")}
              value={formatBDT(order.unitPrice)}
            />
            <DetailRow
              label={t("result.total")}
              value={
                <span className="font-semibold">
                  {formatBDT(order.totalAmount)}
                </span>
              }
            />
            <DetailRow
              label={t("result.targetNumber")}
              value={order.targetNumber ?? t("result.notProvided")}
            />
            <DetailRow
              label={t("result.note")}
              value={order.note ?? t("result.notProvided")}
            />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>{t("result.summary")}</CardTitle>
          </CardHeader>
          <CardContent className="divide-y">
            <DetailRow
              label={t("result.orderId")}
              value={
                <span className="font-mono text-xs break-all">{order.id}</span>
              }
            />
            <DetailRow
              label={t("result.paymentStatus")}
              value={
                <Badge variant={paymentBadgeVariant(order.paymentStatus)}>
                  {paymentStatusLabels[order.paymentStatus]}
                </Badge>
              }
            />
            <DetailRow
              label={t("result.fulfilmentStatus")}
              value={
                <Badge variant="outline">
                  {orderStatusLabels[order.status]}
                </Badge>
              }
            />
            <DetailRow
              label={t("result.placedOn")}
              value={formatDateTime(order.createdAt)}
            />
            <DetailRow
              label={t("result.lastUpdated")}
              value={formatDateTime(order.updatedAt)}
            />
            {order.completedAt ? (
              <DetailRow
                label={t("result.completedOn")}
                value={formatDateTime(order.completedAt)}
              />
            ) : null}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
