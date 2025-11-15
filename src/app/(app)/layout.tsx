'use client';

import type { ReactNode } from 'react';
import { AppSidebar } from '@/components/organisms/app-sidebar';
import {
  SidebarProvider,
  SidebarInset,
  SidebarTrigger
} from '@/components/ui/sidebar';

interface AppLayoutProps {
  children: ReactNode;
}

/**
 * App Layout
 * Main layout for authenticated pages
 * Features: Modern shadcn/ui Sidebar with collapsible functionality
 */
export default function AppLayout({ children }: AppLayoutProps) {
  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        {/* Header with sidebar trigger */}
        <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
          <SidebarTrigger className="-ml-1" />
          <div className="flex flex-1 items-center justify-between">
            <h1 className="text-lg font-semibold">Gym Tracker</h1>
            {/* You can add user menu or other header items here */}
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 overflow-y-auto bg-gray-50 dark:bg-gray-950">
          <div className="container mx-auto p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  );
}
