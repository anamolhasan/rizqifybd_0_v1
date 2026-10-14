import Link from "next/link"
import { Fragment } from "react"
import { ArrowRight, CheckCircle2, Sparkles } from "lucide-react"
import { getTranslations } from "next-intl/server"

const TRUST_KEYS = ["trust.0", "trust.1", "trust.2"] as const

export async function FeaturesCTA() {
  const t = await getTranslations("features.cta")

  return (
    <section className="relative isolate overflow-hidden bg-muted/30 py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-96 -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="group relative isolate overflow-hidden rounded-3xl border border-white/80 bg-white/55 shadow-xl shadow-primary/10 backdrop-blur-2xl sm:rounded-[2rem]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(16,120,85,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,120,85,0.045)_1px,transparent_1px)] bg-size-[36px_36px] opacity-70"
          />
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -z-10 size-72 -translate-x-1/2 rounded-full bg-primary/15 blur-[100px]"
          />

          <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 py-12 text-center sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-2 text-xs font-semibold tracking-wide text-primary shadow-sm backdrop-blur-xl sm:text-sm">
              <Sparkles className="size-4" aria-hidden="true" />
              {t("badge")}
            </div>

            <h2 className="mt-6 max-w-3xl text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
              {t("title")}
            </h2>

            <p className="mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
              {t("description")}
            </p>

            <div className="mt-8 flex w-full flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
              <Link
                href="/services"
                className="group/primary inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {t("primaryAction")}
                <ArrowRight
                  className="size-4 transition-transform duration-300 group-hover/primary:translate-x-1 motion-reduce:transition-none"
                  aria-hidden="true"
                />
              </Link>

              <Link
                href="/sign-up"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/20 bg-white/65 px-7 py-3 text-sm font-semibold text-foreground shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/90 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary motion-reduce:transition-none motion-reduce:hover:translate-y-0"
              >
                {t("secondaryAction")}
              </Link>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-muted-foreground sm:text-sm">
              {TRUST_KEYS.map((key, index) => (
                <Fragment key={key}>
                  {index > 0 && (
                    <span
                      aria-hidden="true"
                      className="hidden size-1 rounded-full bg-primary/30 sm:block"
                    />
                  )}
                  <span className="inline-flex items-center gap-2">
                    <CheckCircle2 className="size-4 text-primary" aria-hidden="true" />
                    {t(key)}
                  </span>
                </Fragment>
              ))}
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-x-10 bottom-0 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent sm:inset-x-20"
          />
        </div>
      </div>
    </section>
  )
}
