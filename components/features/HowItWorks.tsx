import { Search, ShoppingCart, CheckCircle2 } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Card } from "@/components/ui/card"

const STEP_ICONS = [Search, ShoppingCart, CheckCircle2] as const

export async function HowItWorks() {
  const t = await getTranslations("features.howItWorks")

  return (
    <section
      id="how-it-works"
      className="relative isolate overflow-hidden bg-background py-16 sm:py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-[420px] -translate-x-1/2 rounded-full bg-primary/10 blur-[110px]"
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

        <div className="relative mt-16 grid grid-cols-1 gap-12 lg:grid-cols-3 lg:gap-8">
          <div
            aria-hidden="true"
            className="absolute top-10 right-[16.6667%] left-[16.6667%] hidden border-t border-dashed border-primary/30 lg:block"
          />

          {STEP_ICONS.map((Icon, index) => (
            <div
              key={index}
              className="relative flex flex-col items-center text-center"
            >
              <div className="relative z-10 mb-6 flex size-20 items-center justify-center rounded-full bg-primary font-heading text-2xl font-bold text-primary-foreground shadow-lg shadow-primary/30">
                {t(`steps.${index}.number`)}
              </div>

              <Card className="w-full rounded-2xl border border-white/80 bg-white/55 shadow-lg shadow-primary/5 backdrop-blur-xl">
                <div className="flex flex-col px-6 pt-6 pb-8">
                  <div className="mb-4 flex justify-center">
                    <div className="grid size-14 place-items-center rounded-2xl border border-primary/15 bg-primary/[0.08] text-primary">
                      <Icon size={25} strokeWidth={1.7} aria-hidden="true" />
                    </div>
                  </div>

                  <h3 className="mb-3 text-lg font-bold tracking-tight text-foreground">
                    {t(`steps.${index}.title`)}
                  </h3>

                  <p className="text-sm leading-7 text-muted-foreground">
                    {t(`steps.${index}.description`)}
                  </p>
                </div>
              </Card>
            </div>
          ))}
        </div>

        <div className="mx-auto mt-10 flex max-w-2xl items-start justify-center gap-2 text-center text-sm text-muted-foreground">
          <CheckCircle2
            size={16}
            aria-hidden="true"
            className="mt-0.5 shrink-0 text-primary"
          />
          <span>{t("note")}</span>
        </div>
      </div>
    </section>
  )
}
