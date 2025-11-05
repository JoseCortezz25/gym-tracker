import type { ReactNode } from 'react';
import type { LucideIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

export interface EmptyStateProps {
  /**
   * Icon component from lucide-react
   */
  icon: LucideIcon;
  /**
   * Heading text
   */
  heading: string;
  /**
   * Description or message
   */
  message: string;
  /**
   * Optional action button
   */
  action?: {
    label: string;
    onClick: () => void;
  };
  /**
   * Optional custom action element
   */
  customAction?: ReactNode;
}

/**
 * Empty State Molecule
 * Encouraging message when no data exists
 * Used for empty routines list, empty workout history, etc.
 * Provides clear call-to-action
 */
export function EmptyState({
  icon: Icon,
  heading,
  message,
  action,
  customAction
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center px-4 py-12 text-center">
      {/* Icon */}
      <div
        className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100 dark:bg-gray-800"
        aria-hidden="true"
      >
        <Icon className="h-8 w-8 text-gray-400 dark:text-gray-600" />
      </div>

      {/* Heading */}
      <h3 className="mb-2 text-lg font-semibold text-gray-900 dark:text-gray-50">
        {heading}
      </h3>

      {/* Message */}
      <p className="mb-6 max-w-sm text-sm text-gray-600 dark:text-gray-400">
        {message}
      </p>

      {/* Action */}
      {action && (
        <Button onClick={action.onClick} size="lg">
          {action.label}
        </Button>
      )}

      {/* Custom Action */}
      {customAction && customAction}
    </div>
  );
}
