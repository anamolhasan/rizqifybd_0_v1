"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { ArrowRight, ChevronDown, LayoutGrid, Tag } from "lucide-react";

import { useCategories } from "@/hooks/use-categories";
import { cn } from "@/lib/utils";

import { SERVICES_ROUTE } from "./nav-config";

const TRIGGER_CLASS =
  "inline-flex items-center gap-1 rounded-md px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60";

export function CategoryMegaMenu() {
  const [open, setOpen] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const { data, isLoading, isError } = useCategories();

  const categories = data?.data ?? [];
  const hasCategories = !isLoading && !isError && categories.length > 0;

  useEffect(() => {
    return () => {
      if (closeTimer.current) clearTimeout(closeTimer.current);
    };
  }, []);

  function openNow() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    setOpen(true);
  }

  function scheduleClose() {
    if (closeTimer.current) clearTimeout(closeTimer.current);
    closeTimer.current = setTimeout(() => setOpen(false), 120);
  }

  return (
    <div
      className="relative"
      onMouseEnter={openNow}
      onMouseLeave={scheduleClose}
      onBlur={(event) => {
        if (!event.currentTarget.contains(event.relatedTarget as Node)) {
          setOpen(false);
        }
      }}
      onKeyDown={(event) => {
        if (event.key === "Escape") setOpen(false);
      }}
    >
      <button
        type="button"
        className={cn(TRIGGER_CLASS, open && "bg-muted text-foreground")}
        aria-expanded={open}
        aria-haspopup="true"
        aria-controls="category-mega-menu"
        onClick={() => setOpen((value) => !value)}
      >
        <LayoutGrid className="size-4" />
        ক্যাটাগরি
        <ChevronDown
          className={cn("size-3.5 transition-transform", open && "rotate-180")}
        />
      </button>

      {open ? (
        <div
          id="category-mega-menu"
          role="region"
          aria-label="ক্যাটাগরি"
          className="absolute top-full left-0 z-50 mt-1 w-[46rem] max-w-[calc(100vw-7rem)] overflow-hidden rounded-xl border border-border bg-popover text-popover-foreground shadow-lg"
        >
          <div className="p-4">
            {isLoading ? (
              <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                {Array.from({ length: 6 }).map((_, index) => (
                  <div
                    key={index}
                    className="h-12 animate-pulse rounded-lg bg-muted"
                  />
                ))}
              </div>
            ) : hasCategories ? (
              <div className="grid gap-1 sm:grid-cols-2 lg:grid-cols-3">
                {categories.slice(0, 12).map((category) => (
                  <Link
                    key={category.id}
                    href={SERVICES_ROUTE}
                    onClick={() => setOpen(false)}
                    className="group flex items-start gap-3 rounded-lg p-2.5 transition-colors hover:bg-muted focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring/60"
                  >
                    <span className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-lg bg-sky-500/10 text-sky-600 dark:text-sky-400">
                      <Tag className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-sm font-medium group-hover:text-sky-600 dark:group-hover:text-sky-400">
                        {category.title}
                      </span>
                      {category.description ? (
                        <span className="line-clamp-1 text-xs text-muted-foreground">
                          {category.description}
                        </span>
                      ) : null}
                    </span>
                  </Link>
                ))}
              </div>
            ) : (
              <p className="px-1 py-2 text-sm text-muted-foreground">
                ক্যাটাগরি তালিকা বর্তমানে উপলব্ধ নয়।
              </p>
            )}
          </div>

          <div className="flex items-center justify-between border-t border-border bg-muted/40 px-4 py-2.5">
            <span className="text-xs text-muted-foreground">
              সমস্ত টেলিকম সেবা এক জায়গায়
            </span>
            <Link
              href={SERVICES_ROUTE}
              onClick={() => setOpen(false)}
              className="inline-flex items-center gap-1 text-sm font-medium text-sky-600 hover:text-sky-500 dark:text-sky-400"
            >
              সব সেবা দেখুন
              <ArrowRight className="size-3.5" />
            </Link>
          </div>
        </div>
      ) : null}
    </div>
  );
}
