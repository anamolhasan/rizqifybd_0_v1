import { Metadata } from "next"
import { getTranslations } from "next-intl/server"
import { FeaturesHero } from "@/components/features/FeaturesHero"
import { CoreFeaturesGrid } from "@/components/features/CoreFeaturesGrid"
import { HowItWorks } from "@/components/features/HowItWorks"
import { BenefitsSection } from "@/components/features/BenefitsSection"
import { OperatorPreview } from "@/components/features/OperatorPreview"
import { FeaturesFAQ } from "@/components/features/FeaturesFAQ"
import { FeaturesCTA } from "@/components/features/FeaturesCTA"

export async function generateMetadata(): Promise<Metadata> {
  const t = await getTranslations("metadata.features")
  return {
    title: t("title"),
    description: t("description"),
  }
}

export default async function FeaturesPage() {
  return (
    <div className="min-h-screen bg-background">
      <FeaturesHero />
      <CoreFeaturesGrid />
      <HowItWorks />
      <BenefitsSection />
      <OperatorPreview />
      <FeaturesFAQ />
      <FeaturesCTA />
    </div>
  )
}