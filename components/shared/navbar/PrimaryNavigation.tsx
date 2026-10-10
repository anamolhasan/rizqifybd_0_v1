"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

import { cn } from "@/lib/utils";

import { CategoryMegaMenu } from "./CategoryMegaMenu";
import { PUBLIC_NAV_LINKS } from "./nav-config";

const LINK_CLASS =
  "inline-flex items-center border-b-2 border-transparent px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60";

export function PrimaryNavigation() {
  const pathname = usePathname();
  const [home, ...restLinks] = PUBLIC_NAV_LINKS;

  function isActive(href: string, match: "exact" | "prefix") {
    if (match === "exact") return pathname === href;
    return pathname === href || pathname.startsWith(`${href}/`);
  }

  return (
    <nav
      aria-label="প্রধান নেভিগেশন"
      className="hidden h-11 items-center gap-0.5 border-t border-border/60 md:flex"
    >
      {home ? (
        <Link
          href={home.href}
          aria-current={isActive(home.href, home.match) ? "page" : undefined}
          className={cn(
            LINK_CLASS,
            isActive(home.href, home.match) &&
              "border-sky-500 font-semibold text-foreground",
          )}
        >
          {home.label}
        </Link>
      ) : null}

      <CategoryMegaMenu />

      {restLinks.map((link) => {
        const active = isActive(link.href, link.match);
        return (
          <Link
            key={link.href}
            href={link.href}
            aria-current={active ? "page" : undefined}
            className={cn(
              LINK_CLASS,
              active && "border-sky-500 font-semibold text-foreground",
            )}
          >
            {link.label}
          </Link>
        );
      })}
    </nav>
  );
}
