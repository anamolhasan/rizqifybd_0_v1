"use client";

import { OFFER_BADGE_LABELS, OFFER_BADGES } from "./add-offer.constants";
import { cn } from "@/lib/utils";
import type { OfferBadge } from "@/types/offer.types";

interface OfferBadgeSelectorProps {
  value: OfferBadge[];
  onChange: (value: OfferBadge[]) => void;
  disabled?: boolean;
}

export function OfferBadgeSelector({
  value,
  onChange,
  disabled,
}: OfferBadgeSelectorProps) {
  const toggle = (badge: OfferBadge) => {
    onChange(
      value.includes(badge)
        ? value.filter((item) => item !== badge)
        : [...value, badge],
    );
  };

  return (
    <div role="group" aria-label="Offer badges" className="flex flex-wrap gap-2">
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
            {OFFER_BADGE_LABELS[badge]}
          </button>
        );
      })}
    </div>
  );
}
