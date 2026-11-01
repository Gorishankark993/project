import { LandingNavbar } from '@/components/landing/navbar';
import { LandingHero } from '@/components/landing/hero';
import { AnalyticsPreview, FeatureGrid, SecuritySection } from '@/components/landing/sections';
import { CtaFooter, PricingSection } from '@/components/landing/pricing-and-footer';

export default function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <LandingNavbar />
      <main>
        <LandingHero />
        <FeatureGrid />
        <AnalyticsPreview />
        <SecuritySection />
        <PricingSection />
        <CtaFooter />
      </main>
    </div>
  );
}
