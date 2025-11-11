import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { Check } from 'lucide-react';
import { SectionContainer } from '../molecules/section-container';
import { marketingTextMap } from '../../marketing.text-map';

export const RegistrationCta = () => {
  const { registration } = marketingTextMap;

  return (
    <SectionContainer>
      <div className="mx-auto max-w-3xl space-y-8 text-center">
        <div className="space-y-4">
          <h2 className="text-3xl font-bold md:text-4xl lg:text-5xl">
            {registration.heading}
          </h2>
          <p className="text-muted-foreground text-lg">
            {registration.subheading}
          </p>
        </div>

        <div className="flex flex-col justify-center gap-4 sm:flex-row">
          <Button asChild size="lg" className="text-base">
            <Link href="/register">{registration.submitButton}</Link>
          </Button>
        </div>

        <div className="text-muted-foreground flex flex-col items-center justify-center gap-4 text-sm sm:flex-row sm:gap-6">
          {registration.trustSignals.map((signal, index) => (
            <div key={index} className="flex items-center gap-2">
              <Check size={16} className="text-primary" />
              <span>{signal}</span>
            </div>
          ))}
        </div>

        <p className="text-muted-foreground text-sm">
          {registration.hasAccount}{' '}
          <Link
            href="/login"
            className="text-primary font-medium hover:underline"
          >
            {registration.login}
          </Link>
        </p>
      </div>
    </SectionContainer>
  );
};
