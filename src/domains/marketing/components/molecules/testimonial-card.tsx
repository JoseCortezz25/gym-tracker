import { Card, CardContent } from '@/components/ui/card';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Quote } from 'lucide-react';
import type { Testimonial } from '../../types';

interface TestimonialCardProps {
  testimonial: Testimonial;
}

export const TestimonialCard = ({ testimonial }: TestimonialCardProps) => {
  const initials = testimonial.author
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase();

  return (
    <Card className="h-full">
      <CardContent className="space-y-4 pt-6">
        <Quote className="text-primary/20" size={32} />
        <div>
          <h4 className="mb-2 text-lg font-semibold">{testimonial.quote}</h4>
          <p className="text-muted-foreground">{testimonial.content}</p>
        </div>
        <div className="flex items-center gap-3 border-t pt-4">
          <Avatar>
            <AvatarFallback className="bg-primary/10 text-primary font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <p className="font-medium">{testimonial.author}</p>
            <p className="text-muted-foreground text-sm">{testimonial.role}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
