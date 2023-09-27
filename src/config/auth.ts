import { PrismaAdapter } from '@auth/prisma-adapter';
import NextAuth from 'next-auth';
import type { AuthOptions } from 'next-auth';
import CredentialsProvider from 'next-auth/providers/credentials';
import GoogleProvider from 'next-auth/providers/google';

import { authenticateCredentialLogin } from '@/services/auth/auth';

import config from './config';
import dbClient from './database';

export const authOptions: AuthOptions = {
  adapter: PrismaAdapter(dbClient),
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'text' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials, _req) {
        const response = await authenticateCredentialLogin(credentials);

        if (typeof response !== 'undefined' && response) {
          return { ...response, id: response.id.toString() };
        }

        return null;
      },
    }),
    GoogleProvider({
      clientId: process.env.OAUTH_GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.OAUTH_GOOGLE_CLIENT_SECRET as string,
    }),
  ],
  secret: config.auth.secret,
  session: { strategy: 'jwt' },
  callbacks: {
    async redirect({ baseUrl }) {
      return baseUrl;
    },
    async jwt({ token, user }) {
      if (user) {
        token.userId = user.id;
      }

      return Promise.resolve(token);
    },
    async session({ session, token }) {
      if (token?.userId) {
        return { ...session, user: { ...session.user, id: token.userId } };
      }

      return session;
    },
  },
  pages: {
    signIn: '/auth/login',
  },
};

const handler = NextAuth(authOptions);
export default handler;
