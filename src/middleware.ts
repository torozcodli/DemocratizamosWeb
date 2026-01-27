import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { isAdminEmail } from '@/lib/admin';
import { isProd } from '@/lib/seo/env';

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token;
    const pathname = req.nextUrl.pathname;
    const response = NextResponse.next();

    // Add X-Robots-Tag header for non-production environments
    if (!isProd) {
      response.headers.set('X-Robots-Tag', 'noindex, nofollow, noarchive');
    }

    // Helper: Check if user is admin (combines token.isAdmin + hard check for revocation)
    const isAdmin = (token?.isAdmin === true) && isAdminEmail(token.email as string | undefined);

    // Proteger rutas /admin/**
    if (pathname.startsWith('/admin')) {
      if (!token) {
        const signInUrl = new URL('/auth/signin', req.url);
        signInUrl.searchParams.set('callbackUrl', pathname);
        return NextResponse.redirect(signInUrl);
      }

      // Verificar que sea admin (usa token.isAdmin + hard check para revocación inmediata)
      if (!isAdmin) {
        return NextResponse.redirect(new URL('/', req.url));
      }
    }

    // Proteger rutas API /api/admin/**
    if (pathname.startsWith('/api/admin')) {
      if (!token) {
        return NextResponse.json({ error: 'No autenticado' }, { status: 401 });
      }

      // Verificar que sea admin (usa token.isAdmin + hard check para revocación inmediata)
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
    /*
     * Match all request paths except for the ones starting with:
     * - api (API routes)
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * - robots.txt, sitemap.xml (SEO files - but we want to add headers to them)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
};
