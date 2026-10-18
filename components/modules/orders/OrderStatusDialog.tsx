"use client";

import { useEffect } from "react";
import { AlertCircle, Loader2 } from "lucide-react";
import { useTranslations } from "next-intl";

import { Alert, AlertDescription } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useChangeOrderStatus } from "@/hooks/use-orders";
import { ORDER_STATUS_TRANSITIONS, type OrderStatus } from "@/types/enums";
import type { IOrder } from "@/types/order.types";

interface OrderStatusDialogProps {
  order: IOrder | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function OrderStatusDialog({
  order,
  open,
  onOpenChange,
}: OrderStatusDialogProps) {
  const t = useTranslations("admin.orders.status");
  const te = useTranslations("enums");
  const { mutateAsync, isPending, error, reset, variables } =
    useChangeOrderStatus();

  useEffect(() => {
    if (open) reset();
  }, [open, reset]);

  const errorMessage = error
    ? (error.errorSources?.[0]?.message ?? error.message)
    : null;

  const allowed = order ? ORDER_STATUS_TRANSITIONS[order.status] : [];

  const handleChange = async (status: OrderStatus) => {
    if (!order || isPending) return;

    try {
      await mutateAsync({ id: order.id, status });
      onOpenChange(false);
    } catch {
      // Keep the dialog open; the failure is surfaced via toast and inline.
    }
  };

  const handleOpenChange = (nextOpen: boolean) => {
    if (!nextOpen && isPending) return;
    onOpenChange(nextOpen);
  };

  return (
    <Dialog open={open} onOpenChange={handleOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{t("title")}</DialogTitle>
          <DialogDescription>{t("description")}</DialogDescription>
        </DialogHeader>

        {order ? (
          <div className="space-y-3">
            <div className="flex items-center justify-between gap-3 rounded-lg border border-border/60 bg-muted/40 px-3 py-2 text-sm">
              <span className="text-muted-foreground">{t("current")}</span>
              <span className="font-mono text-xs text-foreground">
                {te(`orderStatus.${order.status}`)}
              </span>
            </div>

            {allowed.length === 0 ? (
              <Alert>
                <AlertCircle />
                <AlertDescription>{t("noTransitions")}</AlertDescription>
              </Alert>
            ) : (
              <div className="flex flex-wrap gap-2">
                {allowed.map((status) => {
                  const isThisPending =
                    isPending && variables?.status === status;
                  return (
                    <Button
                      key={status}
                      type="button"
                      variant="outline"
                      disabled={isPending}
                      onClick={() => void handleChange(status)}
                    >
                      {isThisPending ? (
                        <Loader2 className="animate-spin" />
                      ) : null}
                      {te(`orderStatus.${status}`)}
                    </Button>
                  );
                })}
              </div>
            )}

            {errorMessage ? (
              <Alert variant="destructive">
                <AlertCircle />
                <AlertDescription>{errorMessage}</AlertDescription>
              </Alert>
            ) : null}
          </div>
        ) : null}

        <DialogFooter>
          <DialogClose asChild>
            <Button type="button" variant="outline" disabled={isPending}>
              {t("cancel")}
            </Button>
          </DialogClose>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
