import {
  Compass,
  BadgePercent,
  MonitorSmartphone,
  History,
  MousePointerClick,
  CheckCircle2,
} from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Card } from "@/components/ui/card"

const BENEFIT_ICONS = [
  Compass,
  BadgePercent,
  MonitorSmartphone,
  History,
  MousePointerClick,
] as const

export async function BenefitsSection() {
  const t = await getTranslations("features.benefits")

  return (
    <section
      id="benefits"
      className="relative isolate overflow-hidden bg-muted/30 py-16 sm:py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-[420px] -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -left-40 top-1/3 -z-10 size-80 rounded-full bg-emerald-300/20 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-40 bottom-0 -z-10 size-96 rounded-full bg-teal-200/25 blur-[110px]"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/60 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur-xl">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/40 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {t("badge")}
          </div>

          <h2 className="mt-6 text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t("title")}
          </h2>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            {t("subtitle")}
          </p>
        </div>

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6 lg:grid-cols-3">
          {BENEFIT_ICONS.map((Icon, index) => (
            <Card
              key={index}
              className="group relative flex flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/55 p-6 shadow-lg shadow-primary/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:bg-white/70 hover:shadow-xl hover:shadow-primary/10 sm:rounded-3xl sm:p-7 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div className="flex flex-1 flex-col">
                <div className="flex items-start gap-4">
                  <div className="grid size-12 shrink-0 place-items-center rounded-2xl border border-primary/15 bg-primary/[0.08] text-primary transition-colors duration-300 group-hover:bg-primary group-hover:text-primary-foreground motion-reduce:transition-none">
                    <Icon size={22} strokeWidth={1.8} aria-hidden="true" />
                  </div>

                  <div className="flex-1">
                    <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary">
                      {t(`items.${index}.title`)}
                    </h3>
                    <p className="mt-2 text-sm leading-7 text-muted-foreground">
                      {t(`items.${index}.description`)}
                    </p>
                  </div>
                </div>
              </div>
            </Card>
          ))}
        </div>

        <div className="mt-10 flex flex-wrap items-center justify-center gap-x-5 gap-y-4 sm:mt-12">
          {["summary.0", "summary.1", "summary.2"].map((key) => (
            <div
              key={key}
              className="inline-flex items-center gap-2 rounded-full border border-white/70 bg-white/50 px-4 py-2 text-sm text-muted-foreground shadow-sm backdrop-blur-lg"
            >
              <CheckCircle2 size={16} aria-hidden="true" className="shrink-0 text-primary" />
              <span>{t(key)}</span>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
