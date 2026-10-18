"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { AppSubmitButton } from "@/components/shared/form/AppSubmitButton";
import { useCurrentUser } from "@/hooks/use-auth";
import { usePurchaseOfferWithWallet } from "@/hooks/use-orders";
import { useMyWallet } from "@/hooks/use-wallet";
import { ApiError } from "@/lib/api";
import { LOGIN_ROUTE, MY_ORDERS_ROUTE } from "@/lib/constants";
import { formatBDT } from "@/lib/format";
import type { ICreateOrderWithWalletResult } from "@/types/order.types";
import type { IOperatorOffer } from "@/types/operator-offer.types";

interface OrderConfirmationDialogProps {
  offer: IOperatorOffer;
  trigger: React.ReactNode;
}

function createIdempotencyKey(): string {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) {
    return crypto.randomUUID();
  }
  return `${Date.now()}-${Math.random().toString(36).slice(2)}`;
}

export function OrderConfirmationDialog({
  offer,
  trigger,
}: OrderConfirmationDialogProps) {
  const t = useTranslations("offers.purchase");
  const tOffers = useTranslations("offers");
  const tCommon = useTranslations("common");
  const pathname = usePathname();

  const [open, setOpen] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [targetNumber, setTargetNumber] = useState("");
  const [note, setNote] = useState("");
  const [completed, setCompleted] = useState<ICreateOrderWithWalletResult | null>(
    null,
  );

  const { data: user, isLoading: isUserLoading } = useCurrentUser();
  const isAuthenticated = Boolean(user);

  const walletQuery = useMyWallet({ enabled: open && isAuthenticated });
  const balance = walletQuery.data?.balance;
  const balanceLoaded = typeof balance === "number";

  const purchaseMutation = usePurchaseOfferWithWallet();

  // A stable key per intended purchase: retrying an unchanged order resolves to
  // the original server order instead of debiting the wallet twice. Editing the
  // order invalidates the key so the retry reflects the new details.
  const idempotencyKeyRef = useRef<string | null>(null);
  useEffect(() => {
    idempotencyKeyRef.current = null;
  }, [quantity, targetNumber, note]);

  const unitPrice = offer.price;
  const totalAmount = unitPrice * quantity;

  const offerAvailable =
    offer.isActive && !offer.isDeleted && offer.status === "ACTIVE";

  const insufficientBalance =
    isAuthenticated && balanceLoaded && (balance as number) < totalAmount;

  const isSubmitting = purchaseMutation.isPending;
  const canSubmit =
    isAuthenticated &&
    offerAvailable &&
    !insufficientBalance &&
    quantity > 0 &&
    !isSubmitting;

  const summaryLine = t("summaryLine", {
    quantity: String(quantity),
    price: formatBDT(unitPrice),
    total: formatBDT(totalAmount),
  });

  const errorMessage = useMemo(() => {
    const error = purchaseMutation.error;
    if (!error) return null;

    if (error instanceof ApiError && error.status === 401) {
      return t("loginRequiredDescription");
    }

    const message =
      error.errorSources?.map((source) => source.message).join(", ") ||
      error.message;

    switch (message) {
      case "Insufficient wallet balance":
        return t("insufficientBalance");
      case "Offer not found or not available":
        return t("offerUnavailable");
      case "Offer price has changed; please create a new order":
        return t("priceChanged");
      case "Order is already paid":
        return t("alreadyPaid");
      default:
        return message;
    }
  }, [purchaseMutation.error, t]);

  const resetState = useCallback(() => {
    setQuantity(1);
    setTargetNumber("");
    setNote("");
    setCompleted(null);
    idempotencyKeyRef.current = null;
    purchaseMutation.reset();
  }, [purchaseMutation]);

  const handleOpenChange = useCallback(
    (nextOpen: boolean) => {
      setOpen(nextOpen);
      if (!nextOpen) {
        resetState();
      }
    },
    [resetState],
  );

  const handleSubmit = useCallback(
    async (event: React.FormEvent) => {
      event.preventDefault();
      if (!canSubmit) return;

      try {
        if (!idempotencyKeyRef.current) {
          idempotencyKeyRef.current = createIdempotencyKey();
        }

        const result = await purchaseMutation.mutateAsync({
          operatorOfferId: offer.id,
          quantity,
          targetNumber: targetNumber.trim() || undefined,
          note: note.trim() || undefined,
          idempotencyKey: idempotencyKeyRef.current,
        });

        // Only reflect success once the server confirms the paid order.
        setCompleted(result);
      } catch {
        // Errors are surfaced inline and via the mutation hook's toast.
      }
    },
    [
      canSubmit,
      purchaseMutation,
      offer.id,
      quantity,
      targetNumber,
      note,
    ],
  );

  const loginHref = `${LOGIN_ROUTE}?redirect=${encodeURIComponent(pathname)}`;

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogTrigger asChild>{trigger}</DialogTrigger>
      <DialogContent className="sm:max-w-lg">
        {completed ? (
          <>
            <DialogHeader>
              <DialogTitle className="flex items-center gap-2">
                <CheckCircle2 className="size-5 text-emerald-600" aria-hidden="true" />
                {t("successTitle")}
              </DialogTitle>
              <DialogDescription>{t("successDescription")}</DialogDescription>
            </DialogHeader>

            <div className="space-y-3 rounded-lg border border-border/60 bg-background/70 p-4 text-sm">
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">{t("orderId")}</span>
                <span className="font-mono text-xs break-all text-foreground">
                  {completed.order.id}
                </span>
              </div>
              <div className="flex items-center justify-between gap-3">
                <span className="text-muted-foreground">{t("total")}</span>
                <span className="font-semibold text-foreground">
                  {formatBDT(completed.order.totalAmount)}
                </span>
              </div>
            </div>

            <DialogFooter>
              <DialogClose asChild>
                <Button type="button" variant="outline">
                  {t("done")}
                </Button>
              </DialogClose>
              <Button asChild>
                <Link href={`${MY_ORDERS_ROUTE}/${completed.order.id}`}>
                  {t("viewOrder")}
                </Link>
              </Button>
            </DialogFooter>
          </>
        ) : (
          <>
            <DialogHeader>
              <DialogTitle>{t("title")}</DialogTitle>
              <DialogDescription>{t("description")}</DialogDescription>
            </DialogHeader>

            {isUserLoading ? (
              <div className="flex items-center justify-center gap-2 py-8 text-sm text-muted-foreground">
                <Loader2 className="size-4 animate-spin" aria-hidden="true" />
                {tCommon("loading")}
              </div>
            ) : !isAuthenticated ? (
              <>
                <Alert>
                  <AlertCircle />
                  <AlertTitle>{t("loginRequiredTitle")}</AlertTitle>
                  <AlertDescription>
                    {t("loginRequiredDescription")}
                  </AlertDescription>
                </Alert>
                <DialogFooter>
                  <DialogClose asChild>
                    <Button type="button" variant="outline">
                      {t("cancel")}
                    </Button>
                  </DialogClose>
                  <Button asChild>
                    <Link href={loginHref}>{tCommon("signIn")}</Link>
                  </Button>
                </DialogFooter>
              </>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="rounded-lg border border-border/60 bg-background/70 p-4">
                  <p className="text-sm font-medium text-foreground">
                    {offer.operator?.name ?? tOffers("unknownOperator")} —{" "}
                    {offer.name}
                  </p>
                  <p className="mt-1 text-sm text-muted-foreground">
                    {summaryLine}
                  </p>
                </div>

                {!offerAvailable && (
                  <Alert variant="destructive">
                    <AlertCircle />
                    <AlertTitle>{t("offerUnavailableTitle")}</AlertTitle>
                    <AlertDescription>{t("offerUnavailable")}</AlertDescription>
                  </Alert>
                )}

                {errorMessage && (
                  <Alert variant="destructive">
                    <AlertCircle />
                    <AlertTitle>{t("errorTitle")}</AlertTitle>
                    <AlertDescription>{errorMessage}</AlertDescription>
                  </Alert>
                )}

                <div className="grid gap-4 sm:grid-cols-2">
                  <div className="space-y-2">
                    <Label htmlFor="purchase-quantity">{t("quantity")}</Label>
                    <Input
                      id="purchase-quantity"
                      type="number"
                      min={1}
                      step={1}
                      value={quantity}
                      onChange={(event) => {
                        const next = Number(event.target.value);
                        setQuantity(Number.isFinite(next) && next > 0 ? next : 1);
                      }}
                      disabled={isSubmitting}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="purchase-targetNumber">
                      {t("targetNumber")}
                    </Label>
                    <Input
                      id="purchase-targetNumber"
                      value={targetNumber}
                      onChange={(event) => setTargetNumber(event.target.value)}
                      placeholder={t("targetNumber")}
                      disabled={isSubmitting}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="purchase-note">{t("note")}</Label>
                  <Textarea
                    id="purchase-note"
                    value={note}
                    onChange={(event) => setNote(event.target.value)}
                    rows={3}
                    disabled={isSubmitting}
                  />
                </div>

                <div className="space-y-2 rounded-lg border border-border/60 bg-background/70 p-4 text-sm">
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">
                      {t("walletBalance")}
                    </span>
                    <span className="font-medium text-foreground">
                      {walletQuery.isLoading
                        ? tCommon("loading")
                        : balanceLoaded
                          ? formatBDT(balance as number)
                          : t("balanceUnavailable")}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-3">
                    <span className="text-muted-foreground">{t("total")}</span>
                    <span className="font-semibold text-foreground">
                      {formatBDT(totalAmount)}
                    </span>
                  </div>
                  {insufficientBalance && (
                    <p className="text-sm font-medium text-destructive">
                      {t("insufficientBalance")}
                    </p>
                  )}
                </div>

                <DialogFooter>
                  <DialogClose asChild>
                    <Button
                      type="button"
                      variant="outline"
                      disabled={isSubmitting}
                    >
                      {t("cancel")}
                    </Button>
                  </DialogClose>
                  <AppSubmitButton
                    isSubmitting={isSubmitting}
                    submittingText={t("submitting")}
                    disabled={!canSubmit}
                  >
                    {t("payFromWallet")}
                  </AppSubmitButton>
                </DialogFooter>
              </form>
            )}
          </>
        )}
      </DialogContent>
    </Dialog>
  );
}
