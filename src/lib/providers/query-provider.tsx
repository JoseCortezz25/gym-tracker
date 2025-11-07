'use client';

// React Query Provider
// Provides React Query client to the entire app for server state management

import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { useState } from 'react';

export function QueryProvider({ children }: { children: React.ReactNode }) {
  // Create Query Client with default options
  const [queryClient] = useState(
    () =>
      new QueryClient({
        defaultOptions: {
          queries: {
            // Stale time: how long data is considered fresh
            staleTime: 60 * 1000, // 1 minute default
            // Retry failed requests
            retry: (failureCount, error) => {
              // Don't retry on auth errors
              if (
                error instanceof Error &&
                (error.message.includes('Unauthorized') ||
                  error.message.includes('Forbidden'))
              ) {
                return false;
              }
              // Retry up to 3 times for other errors
              return failureCount < 3;
            }
          },
          mutations: {
            // Don't retry mutations by default
            retry: false
          }
        }
      })
  );

  return (
    <QueryClientProvider client={queryClient}>
      {children}
      {/* Show React Query DevTools in development */}
      {process.env.NODE_ENV === 'development' && (
        <ReactQueryDevtools initialIsOpen={false} />
      )}
    </QueryClientProvider>
  );
}
