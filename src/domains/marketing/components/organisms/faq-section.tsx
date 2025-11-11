'use client';

import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger
} from '@/components/ui/accordion';
import { SectionContainer } from '../molecules/section-container';
import { marketingTextMap } from '../../marketing.text-map';

export const FaqSection = () => {
  const { faq } = marketingTextMap;

  return (
    <SectionContainer id="faq" className="bg-muted/30">
      <div className="mx-auto max-w-3xl">
        <div className="mb-12 text-center">
          <h2 className="mb-4 text-3xl font-bold md:text-4xl lg:text-5xl">
            {faq.heading}
          </h2>
        </div>

        <Accordion type="single" collapsible className="space-y-4">
          {faq.items.map((item, index) => (
            <AccordionItem
              key={index}
              value={`item-${index}`}
              className="bg-background rounded-lg border px-6"
            >
              <AccordionTrigger className="text-left font-semibold hover:no-underline">
                {item.question}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground">
                {item.answer}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>
      </div>
    </SectionContainer>
  );
};
