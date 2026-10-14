import Link from "next/link"
import type { CSSProperties } from "react"
import { ArrowRight, Info } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"

// Illustrative accent colours only — these are not operator logos or brand assets.
const OPERATOR_ACCENTS = ["#0f766e", "#d97706", "#be185d", "#dc2626", "#15803d"]
const OFFERS_PER_OPERATOR = 3

export async function OperatorPreview() {
  const t = await getTranslations("features.operatorPreview")

  return (
    <section
      id="operators"
      className="relative isolate overflow-hidden bg-muted/30 py-16 sm:py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex flex-wrap items-center justify-center gap-2">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/60 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur-xl">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/40 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              {t("badge")}
            </div>
            <Badge
              variant="outline"
              className="h-auto rounded-full border-amber-300/70 bg-amber-50 px-3 py-1.5 text-xs font-semibold text-amber-700"
            >
              {t("sampleBadge")}
            </Badge>
          </div>

          <h2 className="mt-6 text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            {t("subtitle")}
          </p>

          <p className="mx-auto mt-4 flex max-w-2xl items-start justify-center gap-2 text-xs leading-6 text-muted-foreground sm:text-sm">
            <Info className="mt-0.5 size-4 shrink-0 text-primary" aria-hidden="true" />
            <span>{t("note")}</span>
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {OPERATOR_ACCENTS.map((accent, operatorIndex) => (
            <Card
              key={operatorIndex}
              style={{ "--op": accent } as CSSProperties}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/60 p-0 shadow-lg shadow-primary/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/25 hover:shadow-xl hover:shadow-primary/10 sm:rounded-3xl motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div
                aria-hidden="true"
                className="h-1.5 w-full bg-[var(--op)] opacity-70"
              />

              <div className="flex items-center gap-3 px-6 pt-5 pb-4">
                <span
                  aria-hidden="true"
                  className="grid size-11 place-items-center rounded-xl text-sm font-extrabold text-white shadow-sm"
                  style={{ background: "var(--op)" }}
                >
                  {t(`operators.${operatorIndex}.code`)}
                </span>
                <h3 className="text-base font-bold tracking-tight text-foreground">
                  {t(`operators.${operatorIndex}.name`)}
                </h3>
              </div>

              <ul className="flex flex-col gap-2 px-4 pb-5">
                {Array.from({ length: OFFERS_PER_OPERATOR }, (_, offerIndex) => {
                  const badgeKey = `operators.${operatorIndex}.offers.${offerIndex}.badge`
                  const hasBadge = t.has(badgeKey)

                  return (
                    <li
                      key={offerIndex}
                      className="flex items-center justify-between gap-3 rounded-xl border border-border/60 bg-background/70 px-4 py-3"
                    >
                      <div className="min-w-0">
                        <p className="truncate text-sm font-semibold text-foreground">
                          {t(
                            `operators.${operatorIndex}.offers.${offerIndex}.title`
                          )}
                        </p>
                        <div className="mt-1 flex flex-wrap items-center gap-1.5">
                          <span className="text-[11px] font-medium tracking-wide text-muted-foreground">
                            {t(
                              `operators.${operatorIndex}.offers.${offerIndex}.type`
                            )}
                          </span>
                          {hasBadge && (
                            <Badge
                              variant="secondary"
                              className="h-4 rounded-full px-1.5 text-[10px] font-semibold"
                            >
                              {t(badgeKey)}
                            </Badge>
                          )}
                        </div>
                      </div>

                      <div className="shrink-0 text-right">
                        <p className="text-sm font-bold text-[var(--op)]">
                          {t(
                            `operators.${operatorIndex}.offers.${offerIndex}.price`
                          )}
                        </p>
                        <p className="text-[11px] text-muted-foreground">
                          {t(
                            `operators.${operatorIndex}.offers.${offerIndex}.validity`
                          )}
                        </p>
                      </div>
                    </li>
                  )
                })}
              </ul>
            </Card>
          ))}

          <Card className="relative flex flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-dashed border-primary/30 bg-primary/[0.04] p-8 text-center shadow-sm sm:rounded-3xl">
            <p className="max-w-xs text-sm leading-6 text-muted-foreground">
              {t("note")}
            </p>
            <Button asChild size="lg" className="glow-cy h-11 px-6 font-heading font-extrabold">
              <Link href="/services">
                {t("cta")}
                <ArrowRight className="ml-2 size-4" aria-hidden="true" />
              </Link>
            </Button>
          </Card>
        </div>
      </div>
    </section>
  )
}
