import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdminEmail } from '@/lib/admin';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;

    // Proteger rutas /admin/**
    if (pathname.startsWith('/admin')) {
      if (!token) {
        const signInUrl = new URL('/auth/signin', req.url);
        signInUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(signInUrl);
      }

      // Verificar que sea admin
      const email = token.email as string | undefined;
      if (!isAdminEmail(email)) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Proteger rutas API /api/admin/**
    if (pathname.startsWith('/api/admin')) {
      if (!token) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
      }

      // Verificar que sea admin
      const email = token.email as string | undefined;
      if (!isAdminEmail(email)) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
      }
    }

    return NextResponse.next();
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        // Para rutas /admin y /api/admin, requerir token
        if (pathname.startsWith('/admin') || pathname.startsWith('/api/admin')) {
          return !!token;
        }
        // Otras rutas son públicas
        return true;
      },
    },
  }
);

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/admin/:path*',
  ],
};
