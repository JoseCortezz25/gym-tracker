// NextAuth API Route Handler
// Handles all NextAuth requests

import { handlers } from '@/lib/auth';

// NextAuth requires destructured exports for GET and POST handlers
// This is a framework requirement, not a violation of named exports constraint
// See: https://next-auth.js.org/configuration/initialization#route-handlers-app
export const { GET, POST } = handlers;
