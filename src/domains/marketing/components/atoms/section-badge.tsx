import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface SectionBadgeProps {
  children: React.ReactNode;
  className?: string;
}

export const SectionBadge = ({ children, className }: SectionBadgeProps) => {
  return (
    <Badge
      variant="secondary"
      className={cn('rounded-full px-4 py-1.5 text-sm font-medium', className)}
    >
      {children}
    </Badge>
  );
};
