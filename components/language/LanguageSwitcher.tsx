"use client";

import { useRef, useTransition, type KeyboardEvent } from "react";
import { useRouter } from "next/navigation";
import { useLocale, useTranslations } from "next-intl";

import { defaultLocale, isLocale, type Locale } from "@/i18n/config";
import { setUserLocale } from "@/i18n/locale";
import { cn } from "@/lib/utils";

const OPTIONS: ReadonlyArray<{ value: Locale; label: string; short: string }> = [
  { value: "bn", label: "বাংলা", short: "বাং" },
  { value: "en", label: "English", short: "EN" },
];

export function LanguageSwitcher({ className }: { className?: string }) {
  const activeLocale = useLocale();
  const t = useTranslations("common");
  const router = useRouter();
  const groupRef = useRef<HTMLDivElement>(null);
  const [isPending, startTransition] = useTransition();

  const active: Locale = isLocale(activeLocale) ? activeLocale : defaultLocale;
  const activeIndex = Math.max(
    0,
    OPTIONS.findIndex((option) => option.value === active),
  );

  function changeLocale(next: Locale) {
    if (next === active || isPending) return;

    startTransition(async () => {
      await setUserLocale(next);
      router.refresh();
    });
  }

  function handleKeyDown(event: KeyboardEvent<HTMLDivElement>) {
    if (event.key !== "ArrowRight" && event.key !== "ArrowLeft") return;

    event.preventDefault();
    const offset = event.key === "ArrowRight" ? 1 : -1;
    const nextIndex = (activeIndex + offset + OPTIONS.length) % OPTIONS.length;
    const buttons = groupRef.current?.querySelectorAll<HTMLButtonElement>(
      '[role="radio"]',
    );
    buttons?.[nextIndex]?.focus();
  }

  return (
    <div
      ref={groupRef}
      role="radiogroup"
      aria-label={t("changeLanguage")}
      aria-busy={isPending}
      onKeyDown={handleKeyDown}
      className={cn(
        "relative grid grid-cols-2 gap-1 rounded-full border border-border/70 bg-muted/60 p-1 transition-opacity",
        isPending && "opacity-70",
        className,
      )}
    >
      <span
        aria-hidden
        className={cn(
          "pointer-events-none absolute inset-y-1 left-1 w-[calc(50%-0.25rem)] rounded-full bg-card shadow-sm ring-1 ring-border/60 transition-transform duration-300 ease-out motion-reduce:transition-none",
          activeIndex === 1
            ? "translate-x-[calc(100%+0.25rem)]"
            : "translate-x-0",
        )}
      />

      {OPTIONS.map(({ value, label, short }) => {
        const isActive = active === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={label}
            lang={value}
            title={label}
            disabled={isPending}
            onClick={() => changeLocale(value)}
            className={cn(
              "relative z-10 flex h-7 items-center justify-center rounded-full px-2.5 text-xs font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50 disabled:cursor-not-allowed",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <span className="sm:hidden">{short}</span>
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
