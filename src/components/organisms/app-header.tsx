'use client';

import { Menu } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

export interface AppHeaderProps {
  /**
   * Callback when menu button is clicked (mobile)
   */
  onMenuClick?: () => void;
}

/**
 * App Header Organism
 * Top navigation bar with logo, user info, and mobile menu toggle
 * Mobile: shows hamburger menu
 * Desktop: shows user avatar
 */
export function AppHeader({ onMenuClick }: AppHeaderProps) {
  return (
    <header className="sticky top-0 z-40 border-b bg-white dark:bg-gray-950">
      <div className="flex h-16 items-center gap-4 px-4">
        {/* Mobile Menu Button */}
        <Button
          variant="ghost"
          size="icon"
          className="lg:hidden"
          onClick={onMenuClick}
          aria-label="Open menu"
        >
          <Menu className="h-5 w-5" aria-hidden="true" />
        </Button>

        {/* Logo */}
        <div className="flex-1">
          <h1 className="text-xl font-bold text-gray-900 dark:text-gray-50">
            Gym Tracker
          </h1>
        </div>

        {/* User Avatar */}
        <Avatar>
          <AvatarFallback>U</AvatarFallback>
        </Avatar>
      </div>
    </header>
  );
}
