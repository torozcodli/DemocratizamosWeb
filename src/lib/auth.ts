import { NextAuthOptions } from 'next-auth';
import GoogleProvider from 'next-auth/providers/google';
import { isAdminEmail } from './admin';

// Sin adapter: el login usa solo JWT y no requiere MongoDB en el callback.
// Así evitas "adapter_error_getUserByAccount" / ETIMEOUT si Atlas no responde (red, firewall, IP).
// El admin se determina por ADMIN_EMAILS. Para persistir usuarios en MongoDB, añade:
// adapter: MongoDBAdapter(clientPromise),
export const authOptions: NextAuthOptions = {
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
        token.id = user.id ?? token.sub ?? user.email ?? '';
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
    redirect({ url, baseUrl }) {
      // Asegurar que tras el login se redirija al callbackUrl (ej. /admin/programas)
      if (url.startsWith('/')) return `${baseUrl}${url}`;
      if (new URL(url).origin === baseUrl) return url;
      return baseUrl;
    },
  },
  pages: {
    signIn: '/auth/signin',
  },
  secret: process.env.NEXTAUTH_SECRET,
};
