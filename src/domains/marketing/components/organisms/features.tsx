import { SectionContainer } from '../molecules/section-container';
import { FeatureCard } from '../molecules/feature-card';
import { marketingTextMap } from '../../marketing.text-map';

export const Features = () => {
  const { features } = marketingTextMap;

  return (
    <SectionContainer id="features" className="bg-muted/30">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
          {features.heading}
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          {features.subheading}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {features.items.map((feature, index) => (
          <FeatureCard key={index} feature={feature} />
        ))}
      </div>
    </SectionContainer>
  );
};
