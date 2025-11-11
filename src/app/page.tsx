import { Hero } from '@/domains/marketing/components/organisms/hero';
import { Features } from '@/domains/marketing/components/organisms/features';
import { Benefits } from '@/domains/marketing/components/organisms/benefits';
import { StatsShowcase } from '@/domains/marketing/components/organisms/stats-showcase';
import { SocialProof } from '@/domains/marketing/components/organisms/social-proof';
import { FaqSection } from '@/domains/marketing/components/organisms/faq-section';
import { RegistrationCta } from '@/domains/marketing/components/organisms/registration-cta';
import { MarketingFooter } from '@/domains/marketing/components/organisms/marketing-footer';

export const dynamic = 'force-static';
export const revalidate = false;

export default function Home() {
  return (
    <div className="flex min-h-screen flex-col">
      <Hero />
      <Features />
      <Benefits />
      <StatsShowcase />
      <SocialProof />
      <FaqSection />
      <RegistrationCta />
      <MarketingFooter />
    </div>
  );
}
