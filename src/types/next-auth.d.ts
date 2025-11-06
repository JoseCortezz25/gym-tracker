// NextAuth Type Extensions
// Extend default NextAuth types with our custom user properties

import 'next-auth';
import 'next-auth/jwt';

declare module 'next-auth' {
  interface Session {
    user: {
      id: string;
      email: string;
      name: string | null;
    };
  }

  interface User {
    id: string;
    email: string;
    name: string | null;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    id: string;
    email: string;
    name: string | null;
  }
}
