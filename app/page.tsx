import { SiteHeader } from "@/components/site-header";
import { HeroSection } from "@/components/hero-section";
import { ProblemSection } from "@/components/problem-section";
import { SolutionSection } from "@/components/solution-section";
import { ProcessSection } from "@/components/process-section";
import { BeforeAfterSection } from "@/components/before-after-section";
import { BrandSection } from "@/components/brand-section";
import { FinalCtaSection } from "@/components/final-cta-section";
import { SiteFooter } from "@/components/site-footer";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <ProcessSection />
        <BeforeAfterSection />
        <BrandSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
