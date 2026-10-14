import { Loader, Wifi, Signal } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { BrandLogo } from "@/components/auth/BrandLogo"

export default async function Loading() {
  const t = await getTranslations("loading")

  return (
    <div className="flex min-h-[calc(100vh-200px)] items-center justify-center px-4">
      <div className="text-center">
        <BrandLogo className="mx-auto mb-8" />

        <div className="mx-auto mb-8 flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
          <Signal className="h-8 w-8 text-primary animate-pulse" aria-hidden="true" />
        </div>

        <div className="mb-4 flex justify-center gap-2">
          {[0, 1, 2].map((i) => (
            <div
              key={i}
              className="h-2 w-2 rounded-full bg-primary animate-pulse"
              style={{ animationDelay: `${i * 150}ms` }}
              aria-hidden="true"
            />
          ))}
        </div>

        <p className="text-muted-foreground">{t("loading")}</p>
        <p className="mt-1 text-sm text-muted-foreground/70">
          {t("preparing")}
        </p>

        <div className="mt-8 flex items-center justify-center gap-4 text-xs text-muted-foreground/60">
          <span className="flex items-center gap-1">
            <Wifi className="h-3 w-3" aria-hidden="true" />
            {t("connecting")}
          </span>
          <span aria-hidden="true">·</span>
          <span className="flex items-center gap-1">
            <Loader className="h-3 w-3 animate-spin" aria-hidden="true" />
            {t("optimizing")}
          </span>
        </div>
      </div>
    </div>
  )
}