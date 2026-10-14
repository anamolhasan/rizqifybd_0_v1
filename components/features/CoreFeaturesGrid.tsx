import {
  Search,
  TowerControl,
  Wifi,
  CalendarClock,
  Tag,
  UserCog,
  ReceiptText,
  ShieldCheck,
  Smartphone,
  CheckCircle2,
} from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Card } from "@/components/ui/card"

const ICONS = [
  Search,
  TowerControl,
  Wifi,
  CalendarClock,
  Tag,
  UserCog,
  ReceiptText,
  ShieldCheck,
  Smartphone,
] as const

export async function CoreFeaturesGrid() {
  const t = await getTranslations("features.coreFeatures")

  return (
    <section
      id="features"
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

        <div className="mt-12 grid grid-cols-1 gap-5 sm:mt-16 sm:grid-cols-2 sm:gap-6 xl:grid-cols-3">
          {ICONS.map((Icon, index) => (
            <Card
              key={index}
              className="group relative flex min-h-[230px] flex-col overflow-hidden rounded-2xl border border-white/80 bg-white/55 p-6 shadow-lg shadow-primary/5 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1.5 hover:border-primary/30 hover:bg-white/70 hover:shadow-xl hover:shadow-primary/10 sm:rounded-3xl sm:p-7 motion-reduce:transition-none motion-reduce:hover:translate-y-0"
            >
              <div
                aria-hidden="true"
                className="pointer-events-none absolute -top-16 -right-16 size-40 rounded-full bg-primary/0 blur-3xl transition-colors duration-500 group-hover:bg-primary/15"
              />

              <span className="pointer-events-none absolute top-4 right-5 select-none text-4xl font-bold text-primary/[0.07] tabular-nums transition-colors duration-300 group-hover:text-primary/[0.13]">
                {String(index + 1).padStart(2, "0")}
              </span>

              <div className="relative flex items-start justify-between gap-4">
                <div className="grid size-14 place-items-center rounded-2xl border border-primary/15 bg-primary/[0.08] text-primary transition-all duration-300 group-hover:border-primary/25 group-hover:bg-primary group-hover:text-primary-foreground group-hover:shadow-lg group-hover:shadow-primary/20 motion-reduce:transition-none">
                  <Icon
                    size={25}
                    strokeWidth={1.7}
                    aria-hidden="true"
                    className="transition-transform duration-300 group-hover:scale-110 motion-reduce:transition-none"
                  />
                </div>
              </div>

              <div className="relative mt-6 flex-1">
                <div className="flex items-center gap-2">
                  <h3 className="text-lg font-bold tracking-tight text-foreground transition-colors duration-300 group-hover:text-primary sm:text-xl">
                    {t(`items.${index}.title`)}
                  </h3>
                  <CheckCircle2
                    size={16}
                    aria-hidden="true"
                    className="shrink-0 text-primary opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  />
                </div>

                <p className="mt-3 text-sm leading-7 text-muted-foreground">
                  {t(`items.${index}.description`)}
                </p>
              </div>

              <div className="relative mt-6 flex items-center gap-2 border-t border-primary/10 pt-4 text-xs font-medium text-muted-foreground">
                <CheckCircle2 size={14} aria-hidden="true" className="text-primary" />
                {t("itemLabel")}
              </div>

              <div className="absolute inset-x-8 bottom-0 h-0.5 origin-center scale-x-0 rounded-full bg-gradient-to-r from-transparent via-primary/70 to-transparent transition-transform duration-500 group-hover:scale-x-100 motion-reduce:transition-none" />
            </Card>
          ))}
        </div>
      </div>
    </section>
  )
}
