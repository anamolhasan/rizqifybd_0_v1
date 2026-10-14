import Link from "next/link"
import type { CSSProperties } from "react"
import { ArrowRight, LayoutGrid, Sparkles } from "lucide-react"
import { getTranslations } from "next-intl/server"

import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { NeonCube } from "@/components/landing/NeonCube"
import { cn } from "@/lib/utils"

const PANELS = [
  { n: "1", color: "var(--cy)", z: 50, pos: "lg:left-0 lg:top-8" },
  { n: "2", color: "var(--mg)", z: 140, pos: "lg:right-0 lg:top-0" },
  { n: "3", color: "var(--vi)", z: 120, pos: "lg:bottom-5 lg:left-3" },
  { n: "4", color: "var(--mi)", z: 60, pos: "lg:bottom-14 lg:right-1" },
]

export async function FeaturesHero() {
  const t = await getTranslations("features.hero")

  return (
    <section className="relative isolate overflow-hidden bg-background py-16 sm:py-20 lg:py-24">
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
        <div className="grid items-center gap-12 lg:min-h-[78vh] lg:grid-cols-2">
          <div>
            <Badge
              variant="outline"
              className="glow-cy mb-6 h-auto rounded-full border-primary/50 px-4 py-1.5 text-sm font-semibold text-primary"
            >
              <Sparkles className="mr-2 h-3.5 w-3.5" aria-hidden="true" />
              {t("badge")}
            </Badge>

            <h1 className="font-heading text-4xl leading-[1.25] font-extrabold tracking-tight text-foreground sm:text-5xl lg:text-[3.4rem]">
              {t("title")}
              <span className="mt-2 block bg-gradient-to-r from-primary via-emerald-600 to-teal-500 bg-clip-text text-transparent">
                {t("titleAccent")}
              </span>
            </h1>

            <p className="mt-6 max-w-[34em] text-lg leading-[1.85] text-muted-foreground">
              {t("description")}
            </p>

            <div className="mt-8 flex flex-wrap gap-3.5">
              <Button
                asChild
                size="lg"
                className="glow-cy h-12 px-6 font-heading text-base font-extrabold"
              >
                <Link href="/services">{t("primaryCta")}</Link>
              </Button>
              <Button
                asChild
                size="lg"
                variant="outline"
                className="glow-mg h-12 border-primary bg-transparent px-6 font-heading text-base font-extrabold text-foreground hover:bg-primary/5 hover:text-primary"
              >
                <Link href="/sign-up">
                  {t("secondaryCta")}
                  <ArrowRight className="ml-2 size-4" aria-hidden="true" />
                </Link>
              </Button>
            </div>
          </div>

          <div
            className="perspective-[1100px]"
            role="img"
            aria-label={t("visualLabel")}
          >
            <div className="scene grid gap-3 sm:grid-cols-2 lg:block">
              <div className="flex justify-center py-4 sm:col-span-2 lg:absolute lg:top-1/2 lg:left-1/2 lg:-translate-x-1/2 lg:-translate-y-1/2 lg:py-0">
                <NeonCube size={170} />
              </div>

              {PANELS.map((panel, index) => (
                <Card
                  key={panel.n}
                  tabIndex={0}
                  style={
                    {
                      "--c": panel.color,
                      "--z": `${panel.z}px`,
                    } as CSSProperties
                  }
                  className={cn(
                    "panel gap-0 rounded-2xl border-border/50 bg-card/80 p-5 ring-0 backdrop-blur-xl lg:absolute lg:w-56",
                    panel.pos
                  )}
                >
                  <span className="panel-num mb-2.5">{panel.n}</span>
                  <h2 className="mb-1.5 font-heading text-lg leading-snug font-extrabold text-foreground">
                    {t(`highlights.${index}.title`)}
                  </h2>
                  <p className="text-sm leading-relaxed text-muted-foreground">
                    {t(`highlights.${index}.description`)}
                  </p>
                </Card>
              ))}
            </div>
          </div>
        </div>

        <ul className="mt-12 flex flex-wrap items-center gap-x-6 gap-y-3 border-t border-border/60 pt-6 text-sm text-muted-foreground lg:mt-16">
          <li className="inline-flex items-center gap-2">
            <LayoutGrid className="size-4 text-primary" aria-hidden="true" />
            <span>{t("primaryCta")}</span>
          </li>
          <li aria-hidden="true" className="hidden size-1 rounded-full bg-primary/30 sm:block" />
          <li className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--cy)]" aria-hidden="true" />
            <span>{t("highlights.0.title")}</span>
          </li>
          <li aria-hidden="true" className="hidden size-1 rounded-full bg-primary/30 sm:block" />
          <li className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--mg)]" aria-hidden="true" />
            <span>{t("highlights.1.title")}</span>
          </li>
          <li aria-hidden="true" className="hidden size-1 rounded-full bg-primary/30 sm:block" />
          <li className="inline-flex items-center gap-2">
            <span className="size-2 rounded-full bg-[var(--vi)]" aria-hidden="true" />
            <span>{t("highlights.2.title")}</span>
          </li>
        </ul>
      </div>
    </section>
  )
}
