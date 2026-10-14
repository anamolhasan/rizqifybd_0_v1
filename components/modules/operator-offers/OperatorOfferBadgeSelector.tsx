"use client";

import { OFFER_BADGES } from "./add-operator-offer.constants";
import { cn } from "@/lib/utils";
import type { OperatorOfferBadge } from "@/types/operator-offer.types";
import { useTranslations } from "next-intl";

interface OperatorOfferBadgeSelectorProps {
  value: OperatorOfferBadge[];
  onChange: (value: OperatorOfferBadge[]) => void;
  disabled?: boolean;
}

export function OperatorOfferBadgeSelector({
  value,
  onChange,
  disabled,
}: OperatorOfferBadgeSelectorProps) {
  const te = useTranslations("enums");
  const toggle = (badge: OperatorOfferBadge) => {
    onChange(
      value.includes(badge)
        ? value.filter((item) => item !== badge)
        : [...value, badge],
    );
  };

  return (
    <div role="group" aria-label={te("offerBadge.group")} className="flex flex-wrap gap-2">
      {OFFER_BADGES.map((badge) => {
        const selected = value.includes(badge);
        return (
          <button
            key={badge}
            type="button"
            aria-pressed={selected}
            disabled={disabled}
            onClick={() => toggle(badge)}
            className={cn(
              "rounded-full border px-3 py-1 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50",
              selected
                ? "border-primary bg-primary/10 text-primary"
                : "border-input text-muted-foreground hover:bg-muted/60",
            )}
          >
            {te(`offerBadge.${badge}`)}
          </button>
        );
      })}
    </div>
  );
}