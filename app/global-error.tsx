
"use client"

import { useSyncExternalStore } from "react"
import {
  NextIntlClientProvider,
  useLocale,
  useTranslations,
} from "next-intl"
import { RefreshCw, WifiOff, AlertTriangle } from "lucide-react"
import Link from "next/link"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BrandLogo } from "@/components/auth/BrandLogo"
import {
  defaultLocale,
  isLocale,
  LOCALE_COOKIE,
  type Locale,
} from "@/i18n/config"
import bnError from "@/messages/bn/error.json"
import enError from "@/messages/en/error.json"

// `global-error.tsx` replaces the root layout, so the `NextIntlClientProvider`
// from `app/layout.tsx` is not available here. We therefore bundle the `error`
// namespace statically and provide our own provider below.
const ERROR_MESSAGES: Record<Locale, { error: typeof enError }> = {
  bn: { error: bnError },
  en: { error: enError },
}

const subscribeToOnlineStatus = (callback: () => void) => {
  window.addEventListener("online", callback)
  window.addEventListener("offline", callback)

  return () => {
    window.removeEventListener("online", callback)
    window.removeEventListener("offline", callback)
  }
}

const getOnlineStatus = () => navigator.onLine
const getServerOnlineStatus = () => true

// Reading the persisted locale from the cookie lets the error screen match the
// user's language without relying on the (replaced) root layout.
const subscribeToLocale = () => () => {}

const getLocale = (): Locale => {
  const match = document.cookie.match(
    new RegExp(`(?:^|;\\s*)${LOCALE_COOKIE}=([^;]+)`),
  )
  const value = match ? decodeURIComponent(match[1]) : undefined

  return isLocale(value) ? value : defaultLocale
}

const getServerLocale = (): Locale => defaultLocale

function GlobalErrorContent({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations("error")
  const locale = useLocale()

  const isOnline = useSyncExternalStore(
    subscribeToOnlineStatus,
    getOnlineStatus,
    getServerOnlineStatus,
  )

  return (
    <html lang={locale}>
      <head>
        <title>{t("globalTitle")}</title>
        <meta
          name="viewport"
          content="width=device-width, initial-scale=1"
        />
      </head>

      <body className="flex min-h-screen items-center justify-center bg-background px-4">
        <Card className="w-full max-w-md">
          <CardContent className="px-6 pt-8 pb-10 text-center">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-full bg-destructive/10">
              {!isOnline ? (
                <WifiOff
                  className="h-8 w-8 text-destructive"
                  aria-hidden="true"
                />
              ) : (
                <AlertTriangle
                  className="h-8 w-8 text-destructive"
                  aria-hidden="true"
                />
              )}
            </div>

            <BrandLogo className="mx-auto mb-6" />

            <h1 className="mb-2 text-2xl font-bold tracking-tight text-foreground">
              {!isOnline ? t("offlineTitle") : t("globalTitle")}
            </h1>

            <p className="mb-6 text-muted-foreground">
              {!isOnline
                ? t("offlineDescription")
                : t("globalDescription")}
            </p>

            <div className="flex flex-col gap-3 sm:flex-row sm:justify-center">
              <Button
                onClick={
                  !isOnline ? () => window.location.reload() : reset
                }
                className="w-full sm:w-auto"
                size="lg"
              >
                <RefreshCw
                  className="mr-2 h-4 w-4"
                  aria-hidden="true"
                />
                {!isOnline ? t("tryAgain") : t("retry")}
              </Button>

              <Button
                asChild
                variant="outline"
                size="lg"
                className="w-full sm:w-auto"
              >
                <Link href="/">{t("goHome")}</Link>
              </Button>
            </div>

            {error.digest && (
              <p className="mt-6 font-mono text-xs text-muted-foreground">
                {t("errorId")}: {error.digest}
              </p>
            )}
          </CardContent>
        </Card>
      </body>
    </html>
  )
}

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const locale = useSyncExternalStore(
    subscribeToLocale,
    getLocale,
    getServerLocale,
  )

  return (
    <NextIntlClientProvider
      locale={locale}
      messages={ERROR_MESSAGES[locale]}
    >
      <GlobalErrorContent error={error} reset={reset} />
    </NextIntlClientProvider>
  )
}
