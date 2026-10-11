"use client";

import { ArrowUp } from "lucide-react";

import { Button } from "@/components/ui/button";

export function BackToTop() {
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
      উপরে যান <ArrowUp />
    </Button>
  );
}
