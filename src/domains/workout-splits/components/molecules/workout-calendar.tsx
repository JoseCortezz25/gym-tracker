/**
 * Workout Calendar Component
 *
 * Calendar widget showing workout completion dates with streak tracking.
 * Molecule component for habit visualization.
 */

'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  ChevronLeft,
  ChevronRight,
  Calendar as CalendarIcon,
  Flame
} from 'lucide-react';
import { workoutSplitsText } from '../../workout-splits.text-map';
import { useWorkoutCalendarMonth } from '../../hooks/use-workout-calendar';
import {
  startOfMonth,
  endOfMonth,
  eachDayOfInterval,
  format,
  isSameDay,
  isToday,
  addMonths,
  subMonths,
  startOfWeek,
  endOfWeek
} from 'date-fns';
import { es } from 'date-fns/locale';
import { cn } from '@/lib/utils';

interface WorkoutCalendarProps {
  className?: string;
  compact?: boolean;
}

export function WorkoutCalendar({
  className,
  compact = false
}: WorkoutCalendarProps) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();

  const { data: calendarData, isLoading } = useWorkoutCalendarMonth(
    year,
    month
  );

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(currentDate);
  const calendarStart = startOfWeek(monthStart, { locale: es });
  const calendarEnd = endOfWeek(monthEnd, { locale: es });

  const calendarDays = eachDayOfInterval({
    start: calendarStart,
    end: calendarEnd
  });

  const handlePrevMonth = () => {
    setCurrentDate(subMonths(currentDate, 1));
  };

  const handleNextMonth = () => {
    setCurrentDate(addMonths(currentDate, 1));
  };

  const handleToday = () => {
    setCurrentDate(new Date());
  };

  const hasWorkout = (date: Date) => {
    if (!calendarData) return false;
    return calendarData.dates.some(d => {
      const workoutDate = new Date(d);
      return isSameDay(date, workoutDate);
    });
  };

  const isCurrentMonth = (date: Date) => {
    return date.getMonth() === month;
  };

  return (
    <Card className={className}>
      <CardHeader className={cn('pb-3', compact && 'pb-2')}>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CalendarIcon className="h-4 w-4" />
            <CardTitle className={cn('text-base', compact && 'text-sm')}>
              {workoutSplitsText.calendar.title}
            </CardTitle>
          </div>
          {calendarData && calendarData.currentStreak > 0 && (
            <Badge variant="secondary" className="gap-1">
              <Flame className="h-3 w-3 text-orange-500" />
              {calendarData.currentStreak} días
            </Badge>
          )}
        </div>
      </CardHeader>

      <CardContent className={cn('space-y-3', compact && 'space-y-2')}>
        {/* Month Navigation */}
        <div className="flex items-center justify-between">
          <Button
            variant="ghost"
            size="sm"
            onClick={handlePrevMonth}
            aria-label={workoutSplitsText.calendar.prevMonthButton}
          >
            <ChevronLeft className="h-4 w-4" />
          </Button>

          <div className="flex items-center gap-2">
            <h3 className="text-sm font-semibold">
              {format(currentDate, 'MMMM yyyy', { locale: es })}
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={handleToday}
              className="text-xs"
            >
              {workoutSplitsText.calendar.todayButton}
            </Button>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={handleNextMonth}
            aria-label={workoutSplitsText.calendar.nextMonthButton}
          >
            <ChevronRight className="h-4 w-4" />
          </Button>
        </div>

        {/* Weekday Headers */}
        <div className="mb-1 grid grid-cols-7 gap-1">
          {workoutSplitsText.calendar.weekdaysShort.map(day => (
            <div
              key={day}
              className="text-muted-foreground py-1 text-center text-xs font-medium"
            >
              {day}
            </div>
          ))}
        </div>

        {/* Calendar Grid */}
        {isLoading ? (
          <div className="grid grid-cols-7 gap-1">
            {Array.from({ length: 35 }).map((_, i) => (
              <div
                key={i}
                className="bg-muted aspect-square animate-pulse rounded-md"
              />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-7 gap-1">
            {calendarDays.map((day, index) => {
              const hasWorkoutOnDay = hasWorkout(day);
              const isTodayDate = isToday(day);
              const isInCurrentMonth = isCurrentMonth(day);

              return (
                <div
                  key={index}
                  className={cn(
                    'relative flex aspect-square items-center justify-center rounded-md text-sm font-medium transition-colors',
                    !isInCurrentMonth && 'text-muted-foreground opacity-30',
                    isInCurrentMonth && !hasWorkoutOnDay && 'hover:bg-muted/50',
                    hasWorkoutOnDay &&
                      'bg-green-100 font-bold text-green-900 dark:bg-green-950 dark:text-green-100',
                    isTodayDate &&
                      !hasWorkoutOnDay &&
                      'ring-primary ring-2 ring-inset',
                    isTodayDate &&
                      hasWorkoutOnDay &&
                      'ring-2 ring-green-600 ring-inset'
                  )}
                  title={
                    hasWorkoutOnDay
                      ? workoutSplitsText.calendar.workoutCompletedLabel
                      : workoutSplitsText.calendar.noWorkoutsLabel
                  }
                >
                  {format(day, 'd')}
                  {hasWorkoutOnDay && (
                    <div className="absolute bottom-0.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-green-600" />
                  )}
                </div>
              );
            })}
          </div>
        )}

        {/* Stats */}
        {calendarData && (
          <div className="grid grid-cols-2 gap-3 border-t pt-2">
            <div className="text-center">
              <p className="text-muted-foreground text-xs">Racha actual</p>
              <p className="flex items-center justify-center gap-1 text-lg font-bold">
                <Flame className="h-4 w-4 text-orange-500" />
                {calendarData.currentStreak}
              </p>
            </div>
            <div className="text-center">
              <p className="text-muted-foreground text-xs">Este mes</p>
              <p className="text-lg font-bold">{calendarData.totalWorkouts}</p>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
