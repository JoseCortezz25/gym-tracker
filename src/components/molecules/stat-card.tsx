import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

export interface StatCardProps {
  /**
   * Icon component from lucide-react
   */
  icon: LucideIcon;
  /**
   * Main statistic value
   */
  value: string | number;
  /**
   * Label describing the stat
   */
  label: string;
  /**
   * Optional trend indicator (e.g., "+12% from last week")
   */
  trend?: ReactNode;
  /**
   * Icon color class (e.g., "text-blue-500")
   */
  iconColor?: string;
  /**
   * ARIA label for accessibility
   */
  ariaLabel?: string;
}

/**
 * Stat Card Molecule
 * Displays a single metric with icon, value, and label
 * Used in Dashboard for streak, weekly workouts, total workouts
 * Responsive: stacks on mobile, grid on tablet/desktop
 */
export function StatCard({
  icon: Icon,
  value,
  label,
  trend,
  iconColor = 'text-blue-600',
  ariaLabel
}: StatCardProps) {
  return (
    <Card>
      <CardContent className="flex items-center gap-4 p-6">
        {/* Icon */}
        <div
          className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-gray-100 dark:bg-gray-800 ${iconColor}`}
          aria-hidden="true"
        >
          <Icon className="h-6 w-6" />
        </div>

        {/* Value and Label */}
        <div className="flex-1">
          <div
            className="text-2xl font-bold text-gray-900 dark:text-gray-50"
            aria-label={ariaLabel || `${label}: ${value}`}
          >
            {value}
          </div>
          <div className="text-sm text-gray-600 dark:text-gray-400">
            {label}
          </div>
          {trend && (
            <div className="mt-1 text-xs text-gray-500 dark:text-gray-500">
              {trend}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
