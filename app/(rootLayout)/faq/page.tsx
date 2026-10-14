import { FAQHero, FAQAccordion, SupportCTA } from "@/components/faq/FAQAccordion"

export default function FAQPage() {
  return (
    <div className="min-h-screen bg-background">
      <FAQHero />
      <main className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8 lg:py-16">
        <FAQAccordion />
      </main>
      <SupportCTA />
    </div>
  )
}