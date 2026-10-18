"use client"

import { useState, useMemo, useCallback } from "react"
import { useTranslations } from "next-intl"
import { Search, X } from "lucide-react"

import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Separator } from "@/components/ui/separator"

import { faqCategories, faqData } from "./faq-data"
import type { FAQItemResolved } from "./types"

export function FAQAccordion() {
  const t = useTranslations("faq")
  const [searchQuery, setSearchQuery] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [openItems, setOpenItems] = useState<string[]>([])

  // Resolve FAQ data with translations
  const allFAQs = useMemo((): FAQItemResolved[] => {
    const resolved: FAQItemResolved[] = []
    for (const [category, items] of Object.entries(faqData)) {
      for (const item of items) {
        resolved.push({
          question: t(item.questionKey),
          answer: t(item.answerKey),
          category,
        })
      }
    }
    return resolved
  }, [t])

  const filteredFAQs = useMemo(() => {
    return allFAQs.filter((faq) => {
      const matchesSearch =
        !searchQuery ||
        faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
        faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
      const matchesCategory =
        selectedCategory === "all" || faq.category === selectedCategory
      return matchesSearch && matchesCategory
    })
  }, [allFAQs, searchQuery, selectedCategory])

  const handleSearchChange = useCallback((value: string) => {
    setSearchQuery(value)
    setOpenItems([])
  }, [])

  const handleCategoryChange = useCallback((category: string) => {
    setSelectedCategory(category)
    setOpenItems([])
  }, [])

  const clearSearch = useCallback(() => {
    setSearchQuery("")
    setSelectedCategory("all")
    setOpenItems([])
  }, [])

  const hasResults = filteredFAQs.length > 0
  const hasActiveFilters = searchQuery || selectedCategory !== "all"

  return (
    <div className="space-y-6">
      {/* Search Field */}
      <div className="relative">
        <Search className="pointer-events-none absolute top-1/2 left-4 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
        <Input
          type="search"
          placeholder={t("hero.searchPlaceholder")}
          value={searchQuery}
          onChange={(e) => handleSearchChange(e.target.value)}
          className="h-12 pl-12 pr-12 text-base"
          aria-label={t("hero.searchPlaceholder")}
        />
        {searchQuery && (
          <Button
            type="button"
            variant="ghost"
            size="icon-sm"
            className="absolute top-1/2 right-3 -translate-y-1/2 text-muted-foreground hover:text-foreground"
            onClick={clearSearch}
            aria-label={t("emptyState.clearSearch")}
          >
            <X className="size-4" />
          </Button>
        )}
      </div>

      {/* Category Filters */}
      <div
        className="flex flex-wrap gap-2"
        role="tablist"
        aria-label={t("categories.all")}
      >
        {faqCategories.map((cat) => (
          <Button
            key={cat.id}
            role="tab"
            aria-selected={selectedCategory === cat.id}
            variant={selectedCategory === cat.id ? "default" : "outline"}
            size="sm"
            onClick={() => handleCategoryChange(cat.id)}
            className="whitespace-nowrap"
          >
            {t(cat.labelKey)}
          </Button>
        ))}
      </div>

      {hasActiveFilters && (
        <Button
          variant="ghost"
          size="sm"
          onClick={clearSearch}
          className="text-sm text-muted-foreground hover:text-foreground"
        >
          {t("emptyState.clearSearch")}
        </Button>
      )}

      <Separator />

      {/* FAQ Accordion */}
      {hasResults ? (
        <Accordion type="multiple" value={openItems} onValueChange={setOpenItems} className="space-y-3">
          {filteredFAQs.map((faq, index) => (
            <AccordionItem key={`${faq.category}-${index}`} value={`${faq.category}-${index}`}>
              <AccordionTrigger className="text-base font-medium hover:no-underline focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 rounded-lg">
                {faq.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground leading-relaxed">
                {faq.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      ) : (
        <Card className="py-12 text-center">
          <CardContent className="pt-6">
            <Search className="mx-auto mb-4 size-12 text-muted-foreground/50" aria-hidden="true" />
            <h3 className="mb-2 text-lg font-semibold">{t("emptyState.noResults")}</h3>
            <p className="mb-4 text-muted-foreground">{t("emptyState.noResultsDescription")}</p>
            {hasActiveFilters && (
              <Button variant="outline" onClick={clearSearch} className="gap-2">
                <X className="size-4" />
                {t("emptyState.clearSearch")}
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  )
}

export function FAQHero() {
  const t = useTranslations("faq")

  return (
    <section className="relative isolate overflow-hidden bg-background py-16 sm:py-20 lg:py-28">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-96 -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-32 -left-20 -z-10 size-80 rounded-full bg-emerald-300/20 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -right-20 top-1/3 -z-10 size-80 rounded-full bg-teal-200/25 blur-[100px]"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="mx-auto max-w-3xl text-center">
          <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/60 px-4 py-2 text-sm font-semibold text-primary shadow-sm backdrop-blur-xl">
            <span className="relative flex size-2">
              <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/40 motion-reduce:animate-none" />
              <span className="relative inline-flex size-2 rounded-full bg-primary" />
            </span>
            {t("hero.title")}
          </div>

          <h1 className="mt-6 text-3xl leading-tight font-bold tracking-tight text-foreground sm:text-4xl lg:text-5xl">
            {t("hero.title")}
            <span className="mt-2 block bg-linear-to-r from-primary via-emerald-600 to-teal-500 bg-clip-text text-transparent">
              {t("hero.subtitle").split(".")[0]}
            </span>
          </h1>

          <p className="mx-auto mt-5 max-w-2xl text-sm leading-7 text-muted-foreground sm:text-base sm:leading-8">
            {t("hero.subtitle")}
          </p>
        </div>

        {/* Search Field in Hero */}
        <div className="mt-10 mx-auto max-w-2xl">
          <FAQHeroSearch />
        </div>
      </div>
    </section>
  )
}

function FAQHeroSearch() {
  const t = useTranslations("faq")
  const [searchQuery, setSearchQuery] = useState("")

  return (
    <div className="relative">
      <Search className="pointer-events-none absolute top-1/2 left-5 size-5 -translate-y-1/2 text-muted-foreground" aria-hidden="true" />
      <Input
        type="search"
        placeholder={t("hero.searchPlaceholder")}
        value={searchQuery}
        onChange={(e) => setSearchQuery(e.target.value)}
        className="h-14 pl-14 pr-14 text-lg"
        aria-label={t("hero.searchPlaceholder")}
      />
    </div>
  )
}

export function SupportCTA() {
  const t = useTranslations("faq")

  return (
    <section className="relative isolate overflow-hidden bg-background py-16 sm:py-20 lg:py-24">
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 left-1/2 -z-10 size-96 -translate-x-1/2 rounded-full bg-primary/15 blur-[120px]"
      />

      <div className="mx-auto w-full max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="group relative isolate overflow-hidden rounded-3xl border border-white/80 bg-white/55 shadow-xl shadow-primary/6 backdrop-blur-2xl sm:rounded-[2rem]">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute inset-0 -z-10 bg-[linear-gradient(to_right,rgba(16,120,85,0.045)_1px,transparent_1px),linear-gradient(to_bottom,rgba(16,120,85,0.045)_1px,transparent_1px)] bg-size-[36px_36px] opacity-70"
          />

          <div
            aria-hidden="true"
            className="pointer-events-none absolute -top-24 left-1/2 -z-10 size-72 -translate-x-1/2 rounded-full bg-primary/15 blur-[100px] transition-opacity duration-500 group-hover:opacity-80"
          />

          <div className="relative mx-auto flex max-w-4xl flex-col items-center px-5 py-12 text-center sm:px-10 sm:py-16 lg:px-16 lg:py-20">
            <div className="inline-flex items-center gap-2 rounded-full border border-primary/20 bg-white/70 px-4 py-2 text-xs font-semibold tracking-wide text-primary shadow-sm shadow-primary/4 backdrop-blur-xl sm:text-sm">
              <span className="relative flex size-2">
                <span className="absolute inline-flex size-full animate-ping rounded-full bg-primary/40 motion-reduce:animate-none" />
                <span className="relative inline-flex size-2 rounded-full bg-primary" />
              </span>
              {t("support.title")}
            </div>

            <h2 className="mt-6 max-w-2xl text-2xl leading-tight font-bold tracking-tight text-foreground sm:text-3xl lg:text-4xl">
              {t("support.title")}
            </h2>

            <p className="mt-4 max-w-xl text-base leading-7 text-muted-foreground">
              {t("support.description")}
            </p>

            <div className="mt-8 flex flex-col items-stretch justify-center gap-3 sm:w-auto sm:flex-row sm:items-center sm:gap-4">
              <a
                href="mailto:info@rizqifybd.com"
                className="group/primary inline-flex min-h-12 items-center justify-center gap-2 rounded-full bg-primary px-7 py-3 text-sm font-semibold text-primary-foreground shadow-lg shadow-primary/20 transition-all duration-300 hover:-translate-y-0.5 hover:shadow-xl hover:shadow-primary/30 focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                {t("support.contactSupport")}
              </a>

              <a
                href="#"
                className="inline-flex min-h-12 items-center justify-center gap-2 rounded-full border border-primary/20 bg-white/65 px-7 py-3 text-sm font-semibold text-foreground shadow-sm backdrop-blur-xl transition-all duration-300 hover:-translate-y-0.5 hover:border-primary/40 hover:bg-white/90 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-primary"
              >
                {t("support.helpCenter")}
              </a>
            </div>

            <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-3 text-xs text-muted-foreground sm:text-sm">
              <span className="inline-flex items-center gap-2">
                <span className="size-4 text-primary">📧</span>
                info@rizqifybd.com
              </span>

              <span aria-hidden="true" className="hidden size-1 rounded-full bg-primary/30 sm:block" />

              <span className="inline-flex items-center gap-2">
                <span className="size-4 text-primary">📞</span>
                +880 1607 950556
              </span>
            </div>
          </div>

          <div
            aria-hidden="true"
            className="absolute inset-x-10 bottom-0 h-px bg-linear-to-r from-transparent via-primary/50 to-transparent sm:inset-x-20"
          />
        </div>
      </div>
    </section>
  )
}