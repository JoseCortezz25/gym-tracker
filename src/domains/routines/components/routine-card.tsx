import Link from 'next/link';
import { MoreVertical } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu';
import { routinesTextMap } from '../routines.text-map';

export interface RoutineCardProps {
  /**
   * Routine ID
   */
  id: string;
  /**
   * Routine name
   */
  name: string;
  /**
   * Number of days in routine
   */
  days: number;
  /**
   * Total number of exercises across all days
   */
  exercises: number;
  /**
   * Whether this is the active routine
   */
  isActive?: boolean;
  /**
   * Last used date (optional)
   */
  lastUsed?: Date;
  /**
   * Callback for activate action
   */
  onActivate?: () => void;
  /**
   * Callback for delete action
   */
  onDelete?: () => void;
  /**
   * Callback for archive action
   */
  onArchive?: () => void;
}

/**
 * Routine Card Component
 * Displays routine summary with actions
 * Used in Routines List page
 */
export function RoutineCard({
  id,
  name,
  days,
  exercises,
  isActive,
  onActivate,
  onDelete,
  onArchive
}: RoutineCardProps) {
  const text = routinesTextMap.routines;

  return (
    <Card>
      <CardContent className="p-6">
        {/* Header with name and active badge */}
        <div className="mb-4 flex items-start justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">
              {name}
            </h3>
            {isActive && (
              <Badge variant="default" className="mt-2">
                {text.active.badge}
              </Badge>
            )}
          </div>

          {/* More actions menu */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="icon" aria-label="More actions">
                <MoreVertical className="h-5 w-5" aria-hidden="true" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {!isActive && onActivate && (
                <DropdownMenuItem onClick={onActivate}>
                  {text.actions.activate}
                </DropdownMenuItem>
              )}
              {onArchive && (
                <DropdownMenuItem onClick={onArchive}>
                  {text.actions.archive}
                </DropdownMenuItem>
              )}
              {onDelete && (
                <DropdownMenuItem onClick={onDelete} className="text-red-600">
                  {text.actions.delete}
                </DropdownMenuItem>
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Stats */}
        <div className="mb-4 flex gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>
            {days === 1
              ? text.card.day
              : text.card.days.replace('{count}', String(days))}
          </span>
          <span>•</span>
          <span>
            {exercises === 1
              ? text.card.exercise
              : text.card.exercises.replace('{count}', String(exercises))}
          </span>
        </div>

        {/* Actions */}
        <div className="flex gap-2">
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href={`/routines/${id}`}>{text.actions.view}</Link>
          </Button>
          <Button variant="outline" size="sm" asChild className="flex-1">
            <Link href={`/routines/${id}/edit`}>{text.actions.edit}</Link>
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
