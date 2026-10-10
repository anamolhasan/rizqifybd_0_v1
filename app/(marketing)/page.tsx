import CTASection from "@/components/landing/CTASection";
import FeaturesSection from "@/components/landing/FeaturesSection";
import HeroSection from "@/components/landing/HeroSection";
import ServiceGridSection from "@/components/landing/ServiceGridSection";
import StatsSection from "@/components/landing/StatsSection";

export default function Home() {
  return (
    <div className="bg-gray-950 text-slate-100">
      <HeroSection />
      <ServiceGridSection />
      <FeaturesSection />
      <StatsSection />
      <CTASection />
    </div>
  );
}
