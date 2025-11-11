import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Check } from 'lucide-react';
import type { Benefit } from '../../types';

interface BenefitItemProps {
  benefit: Benefit;
}

export const BenefitItem = ({ benefit }: BenefitItemProps) => {
  return (
    <Card className="h-full">
      <CardHeader>
        <CardTitle className="text-xl">{benefit.title}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <p className="text-muted-foreground">{benefit.description}</p>
        <div className="flex items-start gap-2 border-t pt-2">
          <Check className="text-primary mt-0.5 flex-shrink-0" size={20} />
          <p className="text-sm font-medium">{benefit.solution}</p>
        </div>
      </CardContent>
    </Card>
  );
};
