"use client";

import { useEffect } from "react";
import { ThemeProvider as NextThemesProvider, useTheme } from "next-themes";

export const THEME_VALUES = ["emerald", "mint"] as const;
export const DEFAULT_THEME = "emerald";

/**
 * Guards against a stale preference (e.g. a legacy "dark"/"system" value saved
 * before the light-only theme system) so the active theme always resolves to a
 * known value. Runs client-side only, inside the NextThemes provider.
 */
function ThemeNormalizer() {
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    if (theme && !THEME_VALUES.includes(theme as (typeof THEME_VALUES)[number])) {
      setTheme(DEFAULT_THEME);
    }
  }, [theme, setTheme]);

  return null;
}

export function ThemeProvider({
  children,
  ...props
}: React.ComponentProps<typeof NextThemesProvider>) {
  return (
    <NextThemesProvider {...props}>
      {children}
      <ThemeNormalizer />
    </NextThemesProvider>
  );
}
