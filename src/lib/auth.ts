import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { MongoDBAdapter } from '@auth/mongodb-adapter';
import clientPromise from './mongodb';
import { isAdminEmail } from './admin';

export const authOptions: NextAuthOptions = {
  adapter: MongoDBAdapter(clientPromise),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_ID!,
      clientSecret: process.env.GOOGLE_SECRET!,
    }),
  ],
  session: {
    strategy: 'jwt',
    maxAge: 7 * 24 * 60 * 60, // 7 days (in seconds)
  },
  callbacks: {
    async jwt({ token, user, trigger }) {
      // On initial sign-in, set user data
      if (user) {
        token.id = user.id;
        token.email = user.email || '';
        token.isAdmin = isAdminEmail(user.email);
      }
      
      // Revalidate admin status on each request to allow immediate revocation
      // This ensures that if ADMIN_EMAILS changes, access is revoked immediately
      if (token.email) {
        token.isAdmin = isAdminEmail(token.email);
      }
      
      return token;
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string;
        session.user.isAdmin = token.isAdmin as boolean;
      }
      return session;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
