/**
 * Split Badge Component
 *
 * Badge showing split letter (A, B, C, etc.)
 */

import { Badge } from '@/components/ui/badge';
import type { SplitLetter } from '../../types';

interface SplitBadgeProps {
  letter: SplitLetter | string;
  variant?: 'default' | 'secondary' | 'outline' | 'destructive';
  className?: string;
}

export function SplitBadge({
  letter,
  variant = 'default',
  className
}: SplitBadgeProps) {
  return (
    <Badge variant={variant} className={className}>
      División {letter}
    </Badge>
  );
}
