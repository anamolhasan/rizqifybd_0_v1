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
      <span className="flex size-9 items-center justify-center rounded-xl bg-primary text-primary-foreground shadow-lg shadow-primary/30 transition-transform duration-300 group-hover:scale-105">
        <Signal className="size-5" strokeWidth={2.5} />
      </span>
      <span
        className={cn(
          "text-lg font-bold tracking-tight",
          tone === "inverted" ? "text-white" : "text-foreground",
        )}
      >
        Rizqify
        <span className="text-primary">BD</span>
      </span>
    </Link>
  );
}
