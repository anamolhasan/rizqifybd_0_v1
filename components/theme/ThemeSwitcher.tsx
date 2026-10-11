"use client";

import { useSyncExternalStore } from "react";
import { Gem, Leaf } from "lucide-react";
import { useTheme } from "next-themes";

import { cn } from "@/lib/utils";

import { DEFAULT_THEME, THEME_VALUES } from "./ThemeProvider";

type ThemeValue = (typeof THEME_VALUES)[number];

const emptySubscribe = () => () => {};

/** `false` during SSR/hydration, `true` once running on the client. */
function useIsHydrated() {
  return useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false,
  );
}

const OPTIONS: ReadonlyArray<{
  value: ThemeValue;
  label: string;
  icon: typeof Gem;
}> = [
  { value: "emerald", label: "Emerald", icon: Gem },
  { value: "mint", label: "Mint", icon: Leaf },
];

export function ThemeSwitcher({ className }: { className?: string }) {
  const { theme, setTheme } = useTheme();
  const hydrated = useIsHydrated();

  // Keep server and first client render identical to avoid hydration mismatches.
  const active: ThemeValue =
    hydrated && theme ? (theme as ThemeValue) : DEFAULT_THEME;
  const activeIndex = Math.max(
    0,
    OPTIONS.findIndex((option) => option.value === active),
  );

  return (
    <div
      role="radiogroup"
      aria-label="Color theme"
      className={cn(
        "relative grid grid-cols-2 gap-1 rounded-full border border-border/70 bg-muted/60 p-1",
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

      {OPTIONS.map(({ value, label, icon: Icon }) => {
        const isActive = active === value;
        return (
          <button
            key={value}
            type="button"
            role="radio"
            aria-checked={isActive}
            aria-label={`${label} theme`}
            title={`${label} theme`}
            onClick={() => setTheme(value)}
            className={cn(
              "relative z-10 flex h-7 items-center justify-center gap-1.5 rounded-full px-2.5 text-xs font-medium whitespace-nowrap transition-colors outline-none focus-visible:ring-2 focus-visible:ring-ring/50",
              isActive
                ? "text-primary"
                : "text-muted-foreground hover:text-foreground",
            )}
          >
            <Icon
              className={cn(
                "size-3.5 transition-transform duration-300 motion-reduce:transition-none",
                isActive ? "scale-110" : "scale-100",
              )}
            />
            <span className="hidden sm:inline">{label}</span>
          </button>
        );
      })}
    </div>
  );
}
