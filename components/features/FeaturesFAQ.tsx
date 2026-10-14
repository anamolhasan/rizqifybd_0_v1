"use client"

import Link from "next/link"
import { ArrowRight, HelpCircle } from "lucide-react"
import { useTranslations } from "next-intl"

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion"

const FAQ_ITEMS = 6

export function FeaturesFAQ() {
  const t = useTranslations("features.faq")

  return (
    <section
      id="faq"
      className="relative isolate overflow-hidden bg-background py-16 sm:py-20 lg:py-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-[420px] -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]"
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

        <div className="mx-auto mt-12 max-w-3xl sm:mt-16">
          <Accordion
            type="single"
            collapsible
            className="flex flex-col gap-3"
          >
            {Array.from({ length: FAQ_ITEMS }, (_, index) => (
              <AccordionItem
                key={index}
                value={`feature-faq-${index}`}
                className="rounded-2xl border border-border/70 bg-white/60 px-5 backdrop-blur-xl transition-colors data-[state=open]:border-primary/30"
              >
                <AccordionTrigger className="items-center gap-4 py-5 text-left text-base font-semibold tracking-tight text-foreground hover:no-underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                  {t(`items.${index}.question`)}
                </AccordionTrigger>
                <AccordionContent className="pb-5 text-sm leading-7 text-muted-foreground">
                  {t(`items.${index}.answer`)}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          <div className="mt-8 flex justify-center">
            <Link
              href="/faq"
              className="group inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/60 px-5 py-2.5 text-sm font-semibold text-primary shadow-sm backdrop-blur-xl transition-colors hover:border-primary/40 hover:bg-white/90 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
            >
              <HelpCircle className="size-4" aria-hidden="true" />
              {t("allFaq")}
              <ArrowRight
                className="size-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                aria-hidden="true"
              />
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
}
