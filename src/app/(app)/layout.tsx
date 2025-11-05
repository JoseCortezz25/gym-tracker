'use client';

import { useState } from 'react';
import type { ReactNode } from 'react';
import { AppHeader } from '@/components/organisms/app-header';
import { AppSidebar } from '@/components/organisms/app-sidebar';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * App Layout
 * Main layout for authenticated pages
 * Features: Header, Sidebar (desktop), Sheet drawer (mobile)
 */
export default function AppLayout({ children }: AppLayoutProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden">
      {/* Sidebar - Desktop */}
      <AppSidebar />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Sheet open={isOpen} onOpenChange={setIsOpen}>
          <SheetTrigger asChild>
            <div>
              <AppHeader onMenuClick={() => setIsOpen(true)} />
            </div>
          </SheetTrigger>
          <SheetContent side="left" className="w-64 p-0">
            <AppSidebar />
          </SheetContent>
        </Sheet>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}
