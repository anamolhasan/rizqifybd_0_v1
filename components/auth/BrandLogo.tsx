import Link from "next/link";
import { Signal } from "lucide-react";

import { cn } from "@/lib/utils";

interface BrandLogoProps {
  href?: string;
  className?: string;
  tone?: "default" | "inverted";
}

export function BrandLogo({
  href = "/",
  className,
  tone = "default",
}: BrandLogoProps) {
  return (
    <Link
      href={href}
      className={cn("group inline-flex items-center gap-2.5", className)}
    >
      <span className="flex size-9 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-sky-600 text-slate-950 shadow-lg shadow-sky-500/30 transition-transform duration-300 group-hover:scale-105">
        <Signal className="size-5" strokeWidth={2.5} />
      </span>
      <span
        className={cn(
          "text-lg font-bold tracking-tight",
          tone === "inverted" ? "text-white" : "text-foreground",
        )}
      >
        Rizqify
        <span className="text-sky-500">BD</span>
      </span>
    </Link>
  );
}
