"use client";

import { ArrowUp } from "lucide-react";
import { useTranslations } from "next-intl";

import { Button } from "@/components/ui/button";

export function BackToTop() {
  const t = useTranslations("common");
  return (
    <Button
      type="button"
      variant="outline"
      className="glow-cy h-10 border-neon-cy bg-transparent px-4 text-slate-100 hover:bg-white/5 hover:text-white"
      onClick={() =>
        window.scrollTo({
          top: 0,
          behavior: window.matchMedia("(prefers-reduced-motion: reduce)")
            .matches
            ? "auto"
            : "smooth",
        })
      }
    >
      {t("backToTop")} <ArrowUp />
    </Button>
  );
}
