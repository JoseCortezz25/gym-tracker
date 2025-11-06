import NextAuth from 'next-auth';
import Credentials from 'next-auth/providers/credentials';
import { compare } from 'bcryptjs';
import { prisma } from './db';
import { loginSchema } from '@/domains/auth/schema';

export const { handlers, signIn, signOut, auth } = NextAuth({
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60 // 7 days
  },
  pages: {
    signIn: '/login',
    error: '/login'
  },
  providers: [
    Credentials({
      name: 'credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' }
      },
      async authorize(credentials) {
        try {
          // Validate credentials
          const validated = loginSchema.safeParse(credentials);

          if (!validated.success) {
            return null;
          }

          const { email, password } = validated.data;

          // Find user
          const user = await prisma.user.findUnique({
            where: { email }
          });

          if (!user) {
            return null;
          }

          // Verify password
          const isPasswordValid = await compare(password, user.passwordHash);

          if (!isPasswordValid) {
            return null;
          }

          // Return user (without password)
          return {
            id: user.id,
            email: user.email,
            name: user.name
          };
        } catch (error) {
          // eslint-disable-next-line no-console
          console.error('Auth error:', error);
          return null;
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      return token;
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string;
        session.user.email = token.email as string;
        session.user.name = token.name as string | null;
      }
      return session;
    }
  }
});
