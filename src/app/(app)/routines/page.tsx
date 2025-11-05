'use client';

import Link from 'next/link';
import { Plus, Dumbbell } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/molecules/empty-state';
import { RoutineCard } from '@/domains/routines/components/routine-card';
import { routinesTextMap } from '@/domains/routines/routines.text-map';

/**
 * Routines List Page
 * View all workout routines and create new ones
 * UI-only implementation (mock data)
 */
export default function RoutinesPage() {
  const text = routinesTextMap.routines;

  // Mock data (will be replaced with real data in Phase 2)
  const mockRoutines = [
    {
      id: '1',
      name: 'Push-Pull-Legs',
      days: 6,
      exercises: 42,
      isActive: true
    },
    {
      id: '2',
      name: 'Full Body Split',
      days: 3,
      exercises: 18,
      isActive: false
    }
  ];

  const hasRoutines = mockRoutines.length > 0;

  const handleActivate = (id: string) => {
    // eslint-disable-next-line no-console
    console.log('Activate routine:', id);
    // Business logic will be added in Phase 2
  };

  const handleDelete = (id: string) => {
    // eslint-disable-next-line no-console
    console.log('Delete routine:', id);
    // Business logic will be added in Phase 2
  };

  const handleArchive = (id: string) => {
    // eslint-disable-next-line no-console
    console.log('Archive routine:', id);
    // Business logic will be added in Phase 2
  };

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-50">
          {text.heading}
        </h1>
        <Button size="lg" asChild>
          <Link href="/routines/new">
            <Plus className="mr-2 h-5 w-5" aria-hidden="true" />
            {text.create}
          </Link>
        </Button>
      </div>

      {/* Routines Grid */}
      {hasRoutines ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {mockRoutines.map(routine => (
            <RoutineCard
              key={routine.id}
              id={routine.id}
              name={routine.name}
              days={routine.days}
              exercises={routine.exercises}
              isActive={routine.isActive}
              onActivate={() => handleActivate(routine.id)}
              onDelete={() => handleDelete(routine.id)}
              onArchive={() => handleArchive(routine.id)}
            />
          ))}
        </div>
      ) : (
        <EmptyState
          icon={Dumbbell}
          heading={text.empty.heading}
          message={text.empty.message}
          action={{
            label: text.empty.action,
            onClick: () => {
              window.location.href = '/routines/new';
            }
          }}
        />
      )}
    </div>
  );
}
