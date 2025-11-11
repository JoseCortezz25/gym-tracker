import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SectionContainer } from '../molecules/section-container';
import { marketingTextMap } from '../../marketing.text-map';
import { Dumbbell } from 'lucide-react';

export const Hero = () => {
  const { hero } = marketingTextMap;

  return (
    <SectionContainer className="pt-24 pb-16 md:pt-32 md:pb-24">
      <div className="grid items-center gap-12 lg:grid-cols-2">
        {/* Content */}
        <div className="space-y-8">
          <div className="space-y-4">
            <h1 className="text-4xl font-bold tracking-tight md:text-5xl lg:text-6xl">
              {hero.headline}
            </h1>
            <p className="text-muted-foreground max-w-2xl text-lg md:text-xl">
              {hero.subheadline}
            </p>
          </div>

          <div className="flex flex-col gap-4 sm:flex-row">
            <Button asChild size="lg" className="text-base">
              <Link href="/register">{hero.primaryCta}</Link>
            </Button>
            <Button asChild size="lg" variant="outline" className="text-base">
              <a href="#features">{hero.secondaryCta}</a>
            </Button>
          </div>

          <p className="text-muted-foreground text-sm">{hero.trustSignal}</p>
        </div>

        {/* Visual */}
        <div className="relative">
          <div className="from-primary/20 to-primary/5 flex aspect-square items-center justify-center rounded-2xl bg-gradient-to-br">
            <Dumbbell size={120} className="text-primary/40" />
          </div>
        </div>
      </div>
    </SectionContainer>
  );
};
