import Link from 'next/link';
import { LayoutDashboard, Dumbbell, History, ListChecks } from 'lucide-react';
import { Separator } from '@/components/ui/separator';

const navigation = [
  { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
  { name: 'Routines', href: '/routines', icon: Dumbbell },
  { name: 'Exercises', href: '/exercises', icon: ListChecks },
  { name: 'History', href: '/history', icon: History }
];

/**
 * App Sidebar Organism
 * Main navigation sidebar (desktop only)
 * Hidden on mobile (replaced by sheet drawer)
 */
export function AppSidebar() {
  return (
    <aside className="hidden w-64 border-r bg-gray-50 lg:block dark:bg-gray-900">
      <nav className="flex h-full flex-col p-4">
        {/* Logo */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 dark:text-gray-50">
            Gym Tracker
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400">
            Track your progress
          </p>
        </div>

        <Separator className="mb-6" />

        {/* Navigation Links */}
        <ul className="space-y-2">
          {navigation.map(item => (
            <li key={item.name}>
              <Link
                href={item.href}
                className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-700 transition-colors hover:bg-gray-100 hover:text-gray-900 dark:text-gray-300 dark:hover:bg-gray-800 dark:hover:text-gray-50"
              >
                <item.icon className="h-5 w-5" aria-hidden="true" />
                <span>{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </aside>
  );
}
