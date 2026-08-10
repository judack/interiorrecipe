import { SiteHeader } from "@/components/site-header";
import { SocialQuickMenu } from "@/components/social-quick-menu";
import { HeroSection } from "@/components/hero-section";
import { ProblemSection } from "@/components/problem-section";
import { SolutionSection } from "@/components/solution-section";
import { ProcessSection } from "@/components/process-section";
import { FeaturedProductsSection } from "@/components/featured-products-section";
import { BrandSection } from "@/components/brand-section";
import { FinalCtaSection } from "@/components/final-cta-section";
import { SiteFooter } from "@/components/site-footer";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <>
      <SiteHeader />
      <SocialQuickMenu />
      <main>
        <HeroSection />
        <ProblemSection />
        <SolutionSection />
        <ProcessSection />
        <FeaturedProductsSection />
        <BrandSection />
        <FinalCtaSection />
      </main>
      <SiteFooter />
    </>
  );
}
