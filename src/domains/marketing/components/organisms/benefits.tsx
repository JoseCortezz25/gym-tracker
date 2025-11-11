import { SectionContainer } from '../molecules/section-container';
import { BenefitItem } from '../molecules/benefit-item';
import { marketingTextMap } from '../../marketing.text-map';

export const Benefits = () => {
  const { benefits } = marketingTextMap;

  return (
    <SectionContainer>
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
          {benefits.heading}
        </h2>
        <p className="text-muted-foreground mx-auto max-w-2xl text-lg">
          {benefits.subheading}
        </p>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {benefits.items.map((benefit, index) => (
          <BenefitItem key={index} benefit={benefit} />
        ))}
      </div>
    </SectionContainer>
  );
};
