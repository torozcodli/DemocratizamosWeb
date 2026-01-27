# SEO Implementation Summary

**Fecha:** 2026-01-26  
**Implementación:** SEO Técnico Completo - Next.js App Router

---

## Archivos Creados

### Utilidades SEO Base
1. **`src/lib/seo/env.ts`**
   - `isProd`: Detección de entorno producción
   - `robotsDirectives()`: Directivas robots basadas en entorno

2. **`src/lib/seo/url.ts`**
   - `absoluteUrl()`: Convierte paths a URLs absolutas
   - `canonicalPath()`: Normaliza paths (sin trailing slash, query, hash)
   - `canonicalUrl()`: Construye URLs canónicas

3. **`src/lib/seo/metadata.ts`**
   - `buildBaseMetadata()`: Constructor centralizado de metadata
   - Incluye canonical, OpenGraph, Twitter, robots

4. **`src/lib/seo/jsonld.ts`**
   - `organizationJsonLd()`: Schema Organization
   - `websiteJsonLd()`: Schema WebSite
   - `breadcrumbJsonLd()`: Schema BreadcrumbList
   - `articleJsonLd()`: Schema Article para blog posts

### Layouts
5. **`src/app/auth/layout.tsx`** (NUEVO)
   - Metadata noindex para rutas de autenticación

---

## Archivos Modificados

### Configuración Base
1. **`src/config/site.ts`**
   - Agregado `getCanonicalBaseUrl()`: Siempre retorna dominio PROD
   - Agregado `getRequestBaseUrl()`: Puede usar VERCEL_URL (no para canonical)
   - `siteConfig.url` ahora usa `getCanonicalBaseUrl()`

### SEO Core
2. **`src/app/robots.ts`**
   - Bloquea indexación en NO-PROD (`disallow: /`)
   - Sitemap solo en producción
   - Usa `getCanonicalBaseUrl()` para sitemap URL

3. **`src/app/sitemap.ts`**
   - Incluye todas las rutas estáticas
   - Incluye rutas dinámicas desde MongoDB (posts, programs, tools)
   - `lastModified` desde base de datos
   - `priority` y `changeFrequency` apropiados
   - Manejo de errores (fallback a rutas estáticas)

4. **`src/middleware.ts`**
   - Agregado header `X-Robots-Tag: noindex, nofollow, noarchive` en NO-PROD
   - Matcher actualizado para incluir todas las rutas (excepto assets)

### Layouts
5. **`src/app/layout.tsx`**
   - Metadata actualizada con canonical base URL
   - Robots directives basados en entorno
   - JSON-LD Organization y WebSite en `<head>`
   - OpenGraph/Twitter consistentes

6. **`src/app/admin/layout.tsx`**
   - Metadata noindex agregada

### Páginas Estáticas
7. **`src/app/page.tsx`**
   - Metadata agregada (canonical a `/inicio`)

8. **`src/app/inicio/page.tsx`**
   - Migrado a `buildBaseMetadata()`
   - Canonical y OG/Twitter consistentes

9. **`src/app/nosotros/page.tsx`**
   - Migrado a `buildBaseMetadata()`
   - URLs absolutas para OG images

10. **`src/app/aviso-de-privacidad/page.tsx`**
    - Migrado a `buildBaseMetadata()`
    - OG type: article

11. **`src/app/blog/page.tsx`**
    - Migrado a `buildBaseMetadata()`
    - Canonical y Twitter cards completos

12. **`src/app/programas/page.tsx`**
    - Migrado a `buildBaseMetadata()`
    - Canonical y Twitter cards completos

13. **`src/app/herramientas/page.tsx`**
    - Migrado a `buildBaseMetadata()`
    - Canonical y Twitter cards completos

### Páginas Dinámicas
14. **`src/app/blog/[slug]/page.tsx`**
    - Metadata mejorada con `buildBaseMetadata()`
    - OG type: article
    - `publishedTime` y `modifiedTime`
    - JSON-LD Article y BreadcrumbList

15. **`src/app/programas/[slug]/page.tsx`**
    - Metadata mejorada con `buildBaseMetadata()`
    - Canonical correcto
    - JSON-LD BreadcrumbList

16. **`src/app/herramientas/[slug]/page.tsx`**
    - Metadata mejorada con `buildBaseMetadata()`
    - Canonical correcto
    - JSON-LD BreadcrumbList

---

## Características Implementadas

### ✅ Canonical URLs
- Todas las páginas tienen `alternates.canonical`
- URLs canónicas usan dominio PROD (nunca VERCEL_URL)
- Paths normalizados (sin trailing slash excepto `/`)

### ✅ Sitemap Completo
- Rutas estáticas: `/inicio`, `/nosotros`, `/aviso-de-privacidad`, `/blog`, `/programas`, `/herramientas`
- Rutas dinámicas desde MongoDB:
  - Todos los posts publicados (`/blog/[slug]`)
  - Todos los programas publicados (`/programas/[slug]`)
  - Todas las herramientas publicadas (`/herramientas/[slug]`)
- `lastModified` desde `updatedAt` o `createdAt`
- Prioridades y frecuencias apropiadas

### ✅ Protección NO-PROD
1. **robots.txt**: `disallow: /` en NO-PROD
2. **Meta robots**: `noindex, nofollow, noarchive` en metadata
3. **X-Robots-Tag header**: Agregado en middleware para NO-PROD

### ✅ JSON-LD Structured Data
- **Organization**: En layout global
- **WebSite**: En layout global
- **Article**: En blog posts (`/blog/[slug]`)
- **BreadcrumbList**: En blog, programas y herramientas

### ✅ OpenGraph/Twitter Consistente
- Todas las páginas tienen OG y Twitter cards completos
- Imágenes absolutas (usando canonical base URL)
- URLs consistentes

### ✅ Admin/Auth Noindex
- Layouts de `/admin` y `/auth` tienen `robots: { index: false }`

---

## Cómo Probar Localmente

### 1. Verificar robots.txt
```bash
# En desarrollo (NO-PROD), debe retornar disallow
curl http://localhost:3000/robots.txt

# Debe mostrar:
# User-agent: *
# Disallow: /
```

### 2. Verificar sitemap.xml
```bash
curl http://localhost:3000/sitemap.xml

# Debe incluir:
# - Rutas estáticas (inicio, nosotros, etc.)
# - Rutas dinámicas si MongoDB está disponible
# - URLs con dominio canonical (https://democratizamoslanovacion.org)
```

### 3. Verificar Metadata en HTML
```bash
# Verificar una página
curl http://localhost:3000/inicio | grep -E "(canonical|og:|twitter:|robots)"

# Debe mostrar:
# - <link rel="canonical" href="https://democratizamoslanovacion.org/inicio">
# - <meta property="og:title" ...>
# - <meta name="twitter:card" ...>
# - <meta name="robots" content="noindex,nofollow,noarchive"> (en dev)
```

### 4. Verificar JSON-LD
```bash
curl http://localhost:3000/inicio | grep -A 20 "application/ld+json"

# Debe mostrar Organization y WebSite schemas
```

### 5. Verificar Blog Post
```bash
# Verificar un post del blog
curl http://localhost:3000/blog/[slug] | grep -E "(canonical|article|breadcrumb)"

# Debe mostrar:
# - Canonical URL
# - Article JSON-LD
# - BreadcrumbList JSON-LD
```

### 6. Verificar X-Robots-Tag Header
```bash
curl -I http://localhost:3000/inicio

# En desarrollo, debe mostrar:
# X-Robots-Tag: noindex, nofollow, noarchive
```

---

## Cómo Verificar en Vercel

### Preview Deployment
1. **robots.txt**: Debe retornar `disallow: /`
2. **Meta robots**: Debe ser `noindex, nofollow, noarchive`
3. **X-Robots-Tag header**: Debe estar presente
4. **Canonical URLs**: Deben usar dominio PROD (no preview URL)

### Production Deployment
1. **robots.txt**: Debe retornar `allow: /` y sitemap URL
2. **Meta robots**: Debe ser `index, follow`
3. **X-Robots-Tag header**: NO debe estar presente
4. **Canonical URLs**: Deben usar `https://democratizamoslanovacion.org`
5. **Sitemap**: Debe incluir todas las rutas

### Verificación Manual
```bash
# Preview
curl https://[preview-url].vercel.app/robots.txt
curl -I https://[preview-url].vercel.app/inicio

# Production
curl https://democratizamoslanovacion.org/robots.txt
curl https://democratizamoslanovacion.org/sitemap.xml
curl -I https://democratizamoslanovacion.org/inicio
```

---

## Variables de Entorno Requeridas

### Producción
```env
NEXT_PUBLIC_SITE_URL=https://democratizamoslanovacion.org
VERCEL_ENV=production
```

### Preview/Development
```env
# NEXT_PUBLIC_SITE_URL puede estar vacío (usa fallback)
VERCEL_ENV=preview  # o development
```

**Nota:** `VERCEL_URL` se usa automáticamente por Vercel pero NO se usa para canonical URLs.

---

## Validación con Herramientas

### Google Search Console
1. Verificar que el sitemap se puede enviar
2. Verificar que las páginas se indexan correctamente
3. Verificar que preview deployments NO aparecen en resultados

### Rich Results Test
- URL: https://search.google.com/test/rich-results
- Verificar JSON-LD schemas (Organization, Article, BreadcrumbList)

### Facebook Sharing Debugger
- URL: https://developers.facebook.com/tools/debug/
- Verificar OG tags y imágenes

### Twitter Card Validator
- URL: https://cards-dev.twitter.com/validator
- Verificar Twitter cards

---

## Notas Importantes

1. **Canonical URLs**: Siempre usan dominio PROD, nunca VERCEL_URL
2. **Sitemap**: Se genera dinámicamente desde MongoDB en cada request
3. **Robots**: Bloquea completamente NO-PROD (triple protección)
4. **JSON-LD**: Organization y WebSite globales, Article solo en blog posts
5. **Breadcrumbs**: Implementados en blog, programas y herramientas
6. **OG Images**: Todas absolutas usando canonical base URL

---

## Próximos Pasos (Opcional)

1. **Dynamic OG Images**: Generar imágenes OG dinámicas por post/programa
2. **More JSON-LD**: Agregar schemas para Programas y Herramientas si es necesario
3. **Sitemap Index**: Si hay muchos posts, considerar sitemap index
4. **Hreflang**: Si se agrega i18n en el futuro

---

**Implementación completada exitosamente** ✅
