
"use client"

import { useSyncExternalStore } from "react"
import { RefreshCw, WifiOff, AlertTriangle } from "lucide-react"
import Link from "next/link"
import { useTranslations } from "next-intl"

import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { BrandLogo } from "@/components/auth/BrandLogo"

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

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  const t = useTranslations("error")

  const isOnline = useSyncExternalStore(
    subscribeToOnlineStatus,
    getOnlineStatus,
    getServerOnlineStatus,
  )

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
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
            {!isOnline ? t("offlineTitle") : t("title")}
          </h1>

          <p className="mb-6 text-muted-foreground">
            {!isOnline
              ? t("offlineDescription")
              : t("description")}
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

            <Link href="/" className="w-full sm:w-auto">
              <Button
                variant="outline"
                size="lg"
                className="w-full"
              >
                {t("goHome")}
              </Button>
            </Link>
          </div>

          {error.digest && (
            <p className="mt-6 font-mono text-xs text-muted-foreground">
              {t("errorId")}: {error.digest}
            </p>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
