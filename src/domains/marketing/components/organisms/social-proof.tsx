import { SectionContainer } from '../molecules/section-container';
import { TestimonialCard } from '../molecules/testimonial-card';
import { marketingTextMap } from '../../marketing.text-map';

export const SocialProof = () => {
  const { social } = marketingTextMap;

  return (
    <SectionContainer className="bg-muted/30">
      <div className="mb-12 text-center">
        <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
          {social.heading}
        </h2>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 lg:gap-8">
        {social.testimonials.map((testimonial, index) => (
          <TestimonialCard key={index} testimonial={testimonial} />
        ))}
      </div>
    </SectionContainer>
  );
};
