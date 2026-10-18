"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

import { Separator } from "@/components/ui/separator";
import { getIconComponent } from "@/lib/iconMapper";
import { cn } from "@/lib/utils";
import type { NavItem, NavSection } from "@/types/dashboard.types";

interface DashboardNavListProps {
  sections: NavSection[];
}

const ITEM_BASE =
  "flex w-full items-center gap-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors";
const ITEM_IDLE =
  "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground";
const ITEM_ACTIVE = "bg-sidebar-primary text-sidebar-primary-foreground";

const CHILD_BASE =
  "flex w-full items-center rounded-md px-3 py-1.5 text-sm transition-colors";
const CHILD_IDLE =
  "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground";
const CHILD_ACTIVE = "bg-sidebar-primary/20 text-sidebar-primary-foreground";

function isGroupActive(pathname: string, item: NavItem): boolean {
  if (pathname === item.href) return true;
  return item.children?.some((child) => pathname === child.href) ?? false;
}

/**
 * Shared dashboard navigation markup (sections, flat items and nested
 * submenus) used by both the desktop sidebar and the mobile sheet.
 */
export function DashboardNavList({ sections }: DashboardNavListProps) {
  const pathname = usePathname();
  const t = useTranslations();
  // Explicit open/closed override per group; falls back to the active route.
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  return (
    <nav className="space-y-6">
      {sections.map((section, sectionIndex) => (
        <div key={sectionIndex}>
          {section.titleKey ? (
            <h4 className="mb-2 px-3 text-xs font-semibold tracking-wide text-sidebar-foreground/60 uppercase">
              {t(section.titleKey)}
            </h4>
          ) : null}

          <div className="space-y-1">
            {section.items.map((item) => {
              const Icon = getIconComponent(item.icon);
              const hasChildren = Boolean(item.children?.length);
              const groupActive = isGroupActive(pathname, item);

              if (hasChildren) {
                const expanded = openGroups[item.href] ?? groupActive;

                return (
                  <div key={`${item.titleKey}-${item.href}`}>
                    <button
                      type="button"
                      aria-expanded={expanded}
                      onClick={() =>
                        setOpenGroups((prev) => ({
                          ...prev,
                          [item.href]: !expanded,
                        }))
                      }
                      className={cn(
                        ITEM_BASE,
                        groupActive ? ITEM_ACTIVE : ITEM_IDLE,
                      )}
                    >
                      <Icon className="size-4 shrink-0" />
                      <span className="truncate">{t(item.titleKey)}</span>
                      <ChevronDown
                        className={cn(
                          "ml-auto size-3.5 shrink-0 transition-transform",
                          expanded ? "rotate-0" : "-rotate-90",
                        )}
                      />
                    </button>

                    {expanded ? (
                      <ul className="mt-1 ml-4 space-y-1 border-l border-sidebar-border pl-3">
                        {item.children?.map((child) => {
                          const childActive = pathname === child.href;
                          return (
                            <li key={`${child.titleKey}-${child.href}`}>
                              <Link
                                href={child.href}
                                aria-current={childActive ? "page" : undefined}
                                className={cn(
                                  CHILD_BASE,
                                  childActive ? CHILD_ACTIVE : CHILD_IDLE,
                                )}
                              >
                                <span className="truncate">
                                  {t(child.titleKey)}
                                </span>
                              </Link>
                            </li>
                          );
                        })}
                      </ul>
                    ) : null}
                  </div>
                );
              }

              const isActive = pathname === item.href;
              return (
                <Link
                  key={`${item.titleKey}-${item.href}`}
                  href={item.href}
                  aria-current={isActive ? "page" : undefined}
                  className={cn(ITEM_BASE, isActive ? ITEM_ACTIVE : ITEM_IDLE)}
                >
                  <Icon className="size-4 shrink-0" />
                  <span className="truncate">{t(item.titleKey)}</span>
                </Link>
              );
            })}
          </div>

          {sectionIndex < sections.length - 1 ? (
            <Separator className="my-4 bg-sidebar-border" />
          ) : null}
        </div>
      ))}
    </nav>
  );
}
