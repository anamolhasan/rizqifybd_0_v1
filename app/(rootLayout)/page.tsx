import CTASection from "@/components/landing/CTASection";
import HeroSection from "@/components/landing/HeroSection";
import OperatorOffersSection from "@/components/landing/OperatorOffersSection";
import ReferralSection from "@/components/landing/ReferralSection";
import ServiceGridSection from "@/components/landing/ServiceGridSection";
import StatsSection from "@/components/landing/StatsSection";

export default function Home() {
  return (
    <div className="">
      <HeroSection />
      <ServiceGridSection />
      <OperatorOffersSection />
      <StatsSection />
      <ReferralSection />
      <CTASection />
    </div>
  );
}
