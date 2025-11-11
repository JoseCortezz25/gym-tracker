import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FeatureIcon } from '../atoms/feature-icon';
import type { Feature } from '../../types';

interface FeatureCardProps {
  feature: Feature;
}

export const FeatureCard = ({ feature }: FeatureCardProps) => {
  return (
    <Card className="h-full transition-all duration-300 hover:scale-105 hover:shadow-lg">
      <CardHeader>
        <FeatureIcon name={feature.icon} size={32} className="mb-4" />
        <CardTitle className="text-xl">{feature.title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground">{feature.description}</p>
      </CardContent>
    </Card>
  );
};
