import {
  Calendar,
  Timer,
  TrendingUp,
  Dumbbell,
  BarChart3,
  Target,
  type LucideIcon
} from 'lucide-react';
import { cn } from '@/lib/utils';

const iconMap: Record<string, LucideIcon> = {
  calendar: Calendar,
  timer: Timer,
  'trending-up': TrendingUp,
  dumbbell: Dumbbell,
  chart: BarChart3,
  target: Target
};

interface FeatureIconProps {
  name: string;
  className?: string;
  size?: number;
}

export const FeatureIcon = ({
  name,
  className,
  size = 24
}: FeatureIconProps) => {
  const Icon = iconMap[name] || Dumbbell;

  return (
    <div
      className={cn(
        'bg-primary/10 flex items-center justify-center rounded-lg p-3',
        className
      )}
    >
      <Icon className="text-primary" size={size} />
    </div>
  );
};
