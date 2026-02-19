import createMiddleware from 'next-intl/middleware';
import { withAuth, type NextRequestWithAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest, NextFetchEvent } from 'next/server';
import { isAdminEmail } from '@/lib/admin';
import { isProd } from '@/lib/seo/env';
import { routing } from '@/i18n/routing';

const intlMiddleware = createMiddleware(routing);

const authMiddleware = withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const response = NextResponse.next();

    if (!isProd) {
      response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    }

    const isAdmin =
      (token?.isAdmin === true) &&
      isAdminEmail(token.email as string | undefined);

    if (pathname.includes('/admin')) {
      if (!token) {
        const signInUrl = new URL('/auth/signin', req.url);
        signInUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(signInUrl);
      }
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    if (pathname.startsWith('/api/admin')) {
      if (!token) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
      }
      if (!isAdmin) {
        return NextResponse.json({ error: 'No autorizado' }, { status: 403 });
      }
    }

    return response;
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname;
        if (
          pathname.includes('/admin') ||
          pathname.startsWith('/api/admin')
        ) {
          return !!token;
        }
        return true;
      },
    },
  }
);

export default function proxy(req: NextRequest, event: NextFetchEvent) {
  const pathname = req.nextUrl.pathname;

  // Redirigir /admin y /admin/* a /es/admin/* para que coincida con [locale]/admin
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return NextResponse.redirect(new URL('/es' + pathname, req.url));
  }

  // Auth pages: no añadir prefijo de locale para que /auth/signin exista
  if (pathname.startsWith('/auth')) {
    return NextResponse.next();
  }
  // Proteger admin con o sin locale: /es/admin/*, /en/admin/*, /admin/*
  if (pathname.includes('/admin') || pathname.startsWith('/api/admin')) {
    return authMiddleware(req as NextRequestWithAuth, event);
  }
  return intlMiddleware(req);
}

export const config = {
  matcher: [
    '/((?!api|trpc|_next|_vercel|.*\\..*).*)',
    '/api/admin/:path*',
  ],
};
