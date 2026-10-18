"use client";

import { Badge } from "@/components/ui/badge";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Separator } from "@/components/ui/separator";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { formatBDT, formatDateTime, formatNumber } from "@/lib/format";
import { calculateProfitBreakdown } from "@/lib/operator-offer-calculations";
import type {
  IOperatorOffer,
  OperatorOfferCommissionType,
} from "@/types/operator-offer.types";
import { useTranslations } from "next-intl";

import { OperatorOfferProfitPanel } from "./OperatorOfferProfitPanel";

interface OperatorOfferDetailsDrawerProps {
  offer: IOperatorOffer | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  // Commercial fields (purchase cost, commissions, profit) are exposed to
  // authorized administrators only. The caller resolves this from the current
  // user's role so the drawer stays presentation-only.
  canViewCommercial: boolean;
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <h3 className="text-xs font-semibold tracking-wide text-muted-foreground uppercase">
        {title}
      </h3>
      <div className="space-y-2">{children}</div>
    </section>
  );
}

function DetailRow({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start justify-between gap-4 text-sm">
      <span className="shrink-0 text-muted-foreground">{label}</span>
      <span className="min-w-0 text-right font-medium break-words">
        {children}
      </span>
    </div>
  );
}

function formatCommission(
  type: OperatorOfferCommissionType,
  value: number,
): string {
  return type === "PERCENTAGE"
    ? `${formatNumber(value)}%`
    : formatBDT(value);
}

export function OperatorOfferDetailsDrawer({
  offer,
  open,
  onOpenChange,
  canViewCommercial,
}: OperatorOfferDetailsDrawerProps) {
  const t = useTranslations("admin.operatorOffers.details");
  const te = useTranslations("enums");

  const benefit =
    offer && offer.amount !== null && offer.amountUnit
      ? `${formatNumber(offer.amount)} ${te(`amountUnit.${offer.amountUnit}`)}`
      : null;

  const validity =
    offer && offer.validityValue !== null && offer.validityUnit
      ? `${formatNumber(offer.validityValue)} ${te(
          `validityUnit.${offer.validityUnit}`,
        )}`
      : null;

  const profitBreakdown = offer
    ? calculateProfitBreakdown({
        regularPrice: offer.regularPrice,
        discountType: offer.discountType,
        discountValue: offer.discountValue,
        companyPurchaseCost: offer.companyPurchasePrice,
        resellerCommissionType: offer.resellerCommissionType,
        resellerCommissionValue: offer.resellerCommissionValue,
        agentCommissionType: offer.agentCommissionType,
        agentCommissionValue: offer.agentCommissionValue,
      })
    : null;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent side="right" className="w-full sm:max-w-md">
        {offer ? (
          <>
            <SheetHeader className="border-b">
              <SheetTitle className="truncate">{offer.name}</SheetTitle>
              <SheetDescription className="truncate">
                {offer.operator?.name ?? t("notProvided")}
              </SheetDescription>
              <div className="flex flex-wrap items-center gap-1.5 pt-2">
                <Badge variant="secondary">
                  {te(`offerType.${offer.offerType}`)}
                </Badge>
                <Badge variant="outline">
                  {te(`offerStatus.${offer.status}`)}
                </Badge>
                <Badge variant={offer.isActive ? "default" : "outline"}>
                  {offer.isActive ? t("active") : t("inactive")}
                </Badge>
              </div>
            </SheetHeader>

            <ScrollArea className="min-h-0 flex-1">
              <div className="space-y-6 p-4">
                <Section title={t("overview")}>
                  <DetailRow label={t("offerName")}>{offer.name}</DetailRow>
                  <DetailRow label={t("operator")}>
                    {offer.operator?.name ?? t("notProvided")}
                  </DetailRow>
                  <DetailRow label={t("offerType")}>
                    {te(`offerType.${offer.offerType}`)}
                  </DetailRow>
                  <DetailRow label={t("status")}>
                    {te(`offerStatus.${offer.status}`)}
                  </DetailRow>
                  <DetailRow label={t("description")}>
                    {offer.description ?? t("notProvided")}
                  </DetailRow>
                  <DetailRow label={t("badges")}>
                    {offer.badges.length > 0
                      ? offer.badges
                          .map((badge) => te(`offerBadge.${badge}`))
                          .join(", ")
                      : t("notProvided")}
                  </DetailRow>
                </Section>

                <Separator />

                <Section title={t("benefit")}>
                  <DetailRow label={t("amount")}>
                    {benefit ?? t("notProvided")}
                  </DetailRow>
                  <DetailRow label={t("validity")}>
                    {validity ?? t("notProvided")}
                  </DetailRow>
                </Section>

                <Separator />

                <Section title={t("pricing")}>
                  <DetailRow label={t("regularPrice")}>
                    {formatBDT(offer.regularPrice)}
                  </DetailRow>
                  <DetailRow label={t("sellingPrice")}>
                    {formatBDT(offer.price)}
                  </DetailRow>
                  <DetailRow label={t("discountType")}>
                    {te(`discountType.${offer.discountType}`)}
                  </DetailRow>
                  <DetailRow label={t("discountValue")}>
                    {offer.discountType === "PERCENTAGE"
                      ? `${formatNumber(offer.discountValue)}%`
                      : formatBDT(offer.discountValue)}
                  </DetailRow>
                </Section>

                <Separator />

                <Section title={t("schedule")}>
                  <DetailRow label={t("startsAt")}>
                    {formatDateTime(offer.startsAt)}
                  </DetailRow>
                  <DetailRow label={t("endsAt")}>
                    {formatDateTime(offer.endsAt)}
                  </DetailRow>
                </Section>

                <Separator />

                <Section title={t("inventory")}>
                  <DetailRow label={t("inventoryMode")}>
                    {te(`inventoryMode.${offer.inventoryMode}`)}
                  </DetailRow>
                  <DetailRow label={t("stockQuantity")}>
                    {offer.stockQuantity === null
                      ? t("unlimited")
                      : formatNumber(offer.stockQuantity)}
                  </DetailRow>
                </Section>

                {canViewCommercial && profitBreakdown ? (
                  <>
                    <Separator />

                    <Section title={t("commercial.title")}>
                      <p className="text-xs leading-5 text-muted-foreground">
                        {t("commercial.subtitle")}
                      </p>
                      <DetailRow label={t("commercial.companyCost")}>
                        {formatBDT(offer.companyPurchasePrice)}
                      </DetailRow>
                      <DetailRow label={t("commercial.resellerCommission")}>
                        {formatCommission(
                          offer.resellerCommissionType,
                          offer.resellerCommissionValue,
                        )}
                      </DetailRow>
                      <DetailRow label={t("commercial.agentCommission")}>
                        {formatCommission(
                          offer.agentCommissionType,
                          offer.agentCommissionValue,
                        )}
                      </DetailRow>
                      <DetailRow label={t("commercial.commissionRate")}>
                        {`${formatNumber(offer.commissionRate)}%`}
                      </DetailRow>
                      <DetailRow label={t("commercial.referralCommissionRate")}>
                        {`${formatNumber(offer.referralCommissionRate)}%`}
                      </DetailRow>

                      <div className="pt-2">
                        <h4 className="mb-2 text-xs font-semibold tracking-wide text-muted-foreground uppercase">
                          {t("commercial.profitTitle")}
                        </h4>
                        <OperatorOfferProfitPanel
                          sellingPrice={offer.price}
                          companyPurchaseCost={offer.companyPurchasePrice}
                          breakdown={profitBreakdown}
                        />
                      </div>
                    </Section>
                  </>
                ) : null}

                <Separator />

                <Section title={t("metadata")}>
                  <DetailRow label={t("offerId")}>
                    <span className="font-mono text-xs">{offer.id}</span>
                  </DetailRow>
                  <DetailRow label={t("createdAt")}>
                    {formatDateTime(offer.createdAt)}
                  </DetailRow>
                  <DetailRow label={t("updatedAt")}>
                    {formatDateTime(offer.updatedAt)}
                  </DetailRow>
                  {offer.deletedAt ? (
                    <DetailRow label={t("deletedAt")}>
                      {formatDateTime(offer.deletedAt)}
                    </DetailRow>
                  ) : null}
                </Section>
              </div>
            </ScrollArea>
          </>
        ) : null}
      </SheetContent>
    </Sheet>
  );
}
