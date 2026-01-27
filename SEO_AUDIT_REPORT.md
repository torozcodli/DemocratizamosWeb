# SEO Audit Report - Democratizamos la Innovación

**Fecha:** 2026-01-26  
**Auditor:** Senior Next.js SEO Engineer  
**Proyecto:** Next.js App Router Application

---

## A) ROUTER IDENTIFICATION

**Router Type:** ✅ **App Router**

**Evidence:**
- Directory structure: `src/app/` exists
- No `src/pages/` directory found
- Files found:
  - `src/app/layout.tsx` - Root layout with `generateMetadata()`
  - `src/app/page.tsx` - Root page (redirects to `/inicio`)
  - `src/app/robots.ts` - Robots.txt handler
  - `src/app/sitemap.ts` - Sitemap handler
  - Multiple route folders: `blog/`, `programas/`, `herramientas/`, `nosotros/`, etc.

---

## B) ROUTES INVENTORY

### Static Routes

| Route | Type | File | Metadata Status |
|-------|------|------|-----------------|
| `/` | Static (redirect) | `src/app/page.tsx` | ❌ No metadata (redirect only) |
| `/inicio` | Static | `src/app/inicio/page.tsx` | ✅ `generateMetadata()` with OG/Twitter |
| `/nosotros` | Static | `src/app/nosotros/page.tsx` | ✅ Static `metadata` export with OG |
| `/aviso-de-privacidad` | Static | `src/app/aviso-de-privacidad/page.tsx` | ✅ Static `metadata` export with OG |
| `/blog` | Static (listing) | `src/app/blog/page.tsx` | ✅ Static `metadata` export with OG |
| `/programas` | Static (listing) | `src/app/programas/page.tsx` | ✅ Static `metadata` export with OG |
| `/herramientas` | Static (listing) | `src/app/herramientas/page.tsx` | ✅ Static `metadata` export with OG |
| `/auth/signin` | Static | `src/app/auth/signin/page.tsx` | ❓ Not audited (likely no metadata) |
| `/admin/*` | Static (protected) | `src/app/admin/**/page.tsx` | ❓ Not audited (admin routes) |

### Dynamic Routes

| Route | Type | File | Data Source | Metadata Status |
|-------|------|------|-------------|-----------------|
| `/blog/[slug]` | Dynamic | `src/app/blog/[slug]/page.tsx` | MongoDB via `PostController.getPostBySlug()` | ✅ `generateMetadata()` with OG |
| `/programas/[slug]` | Dynamic | `src/app/programas/[slug]/page.tsx` | MongoDB via `ProgramController.getProgramBySlug()` | ✅ `generateMetadata()` with OG |
| `/herramientas/[slug]` | Dynamic | `src/app/herramientas/[slug]/page.tsx` | MongoDB via `ToolController.getToolBySlug()` | ✅ `generateMetadata()` with OG |

### Data Source Details

**MongoDB Collections:**
1. **Posts** (`Post` model)
   - Fields: `title`, `slug`, `excerpt`, `imageUrl`, `createdAt`, `updatedAt`, `status`
   - Controller: `PostController` in `src/modules/posts/controllers/post.controller.ts`
   - Methods: `getPostBySlug()`, `listPublishedPosts()`

2. **Programs** (`Program` model)
   - Fields: `title`, `slug`, `shortDescription`, `imageUrl`, `createdAt`, `updatedAt`, `status`, `order`
   - Controller: `ProgramController` in `src/modules/programs/controllers/program.controller.ts`
   - Methods: `getProgramBySlug()`, `listPublishedPrograms()`

3. **Tools** (`Tool` model)
   - Fields: `title`, `slug`, `description`, `imageUrl`, `date`, `createdAt`, `updatedAt`, `isPublished`
   - Controller: `ToolController` in `src/modules/tools/controllers/tool.controller.ts`
   - Methods: `getToolBySlug()`, `listPublishedTools()`

---

## C) CURRENT SEO STATUS

### ✅ Implemented

1. **Metadata API (App Router)**
   - ✅ Root layout: `generateMetadata()` in `src/app/layout.tsx`
     - Uses dynamic headers for base URL
     - Sets `metadataBase`, title template, description, keywords
     - OpenGraph and Twitter cards configured
   - ✅ Dynamic routes: All 3 dynamic routes have `generateMetadata()`
     - `/blog/[slug]`: Uses post data
     - `/programas/[slug]`: Uses program data
     - `/herramientas/[slug]`: Uses tool data
   - ✅ Static routes: Most have static `metadata` exports
     - `/inicio`: Uses `generateMetadata()` with headers
     - `/nosotros`, `/aviso-de-privacidad`, `/blog`, `/programas`, `/herramientas`: Static metadata

2. **OpenGraph Tags**
   - ✅ Present in root layout
   - ✅ Present in all dynamic routes
   - ✅ Present in static routes
   - ⚠️ **Issue**: Some static routes use relative URLs (`/og/og-default.png`) instead of absolute

3. **Twitter Cards**
   - ✅ Present in root layout
   - ✅ Present in `/inicio`
   - ❌ Missing in most other static routes

4. **Robots.txt**
   - ✅ File exists: `src/app/robots.ts`
   - ⚠️ **Issue**: Allows all (`allow: '/'`) - no environment-based blocking
   - ⚠️ **Issue**: Sitemap URL uses `siteConfig.url` which may be incorrect in preview

5. **Sitemap.xml**
   - ✅ File exists: `src/app/sitemap.ts`
   - ❌ **Critical Issue**: Only includes homepage (`siteConfig.url`)
   - ❌ Missing all static routes
   - ❌ Missing all dynamic routes (blog posts, programs, tools)

### ❌ Missing / Incomplete

1. **Canonical URLs**
   - ❌ No canonical tags found in any page
   - ❌ No `alternates.canonical` in metadata

2. **JSON-LD Structured Data**
   - ❌ No JSON-LD schema found
   - ❌ Missing: Organization, Article, BreadcrumbList, etc.

3. **Environment Protection**
   - ❌ No `noindex` for preview/staging environments
   - ❌ `robots.ts` doesn't check `VERCEL_ENV` or similar
   - ⚠️ Risk: Preview deployments may be indexed

4. **Sitemap Completeness**
   - ❌ Only homepage included
   - ❌ Missing: `/inicio`, `/nosotros`, `/aviso-de-privacidad`
   - ❌ Missing: `/blog`, `/programas`, `/herramientas` (listing pages)
   - ❌ Missing: All dynamic routes (posts, programs, tools)

5. **Metadata Completeness**
   - ⚠️ Some OG images use relative URLs (should be absolute)
   - ❌ Missing `alternates.languages` for i18n (if needed)
   - ❌ Missing `robots` directive in metadata
   - ❌ Missing `category` for blog posts
   - ❌ Missing `publishedTime` and `modifiedTime` for articles

6. **Root Page**
   - ❌ `/` redirects to `/inicio` but has no metadata
   - ⚠️ Should have metadata for redirect case

---

## D) BASE URL CONFIGURATION

**Location:** `src/config/site.ts`

**Current Implementation:**
```typescript
function getBaseUrl(): string {
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  return 'https://democratizamoslanovacion.org';
}
```

**Environment Variables:**
- `VERCEL_URL` - Auto-set by Vercel (preview deployments)
- `NEXT_PUBLIC_SITE_URL` - Manual override
- Fallback: `https://democratizamoslanovacion.org`

**Issues:**
- ⚠️ `VERCEL_URL` is used for previews, which may cause incorrect canonical URLs
- ⚠️ No distinction between production, preview, and development
- ⚠️ `siteConfig.url` is evaluated at module load (build time), not runtime

**Usage in Layout:**
- `src/app/layout.tsx` uses `headers()` to get dynamic base URL (better approach)
- Some pages use static `siteConfig.url` (inconsistent)

---

## E) ENVIRONMENT PROTECTION ANALYSIS

### Current State

**Robots.txt:**
- File: `src/app/robots.ts`
- Current: Always allows all (`allow: '/'`)
- No environment checking

**Metadata:**
- No `robots: { index: false }` found in any page
- No conditional logic based on `VERCEL_ENV` or `NODE_ENV`

**Risk Assessment:**
- 🔴 **HIGH RISK**: Preview deployments on Vercel may be indexed
- 🔴 Preview URLs like `project-name-abc123.vercel.app` could appear in search results
- ⚠️ No X-Robots-Tag headers found

**Recommended Protection:**
1. Check `process.env.VERCEL_ENV` in `robots.ts`
2. Return `disallow: /` if `VERCEL_ENV !== 'production'`
3. Add `robots: { index: false }` to metadata in non-production
4. Consider X-Robots-Tag header in middleware

---

## F) RECOMMENDED ARCHITECTURE

### Files to Create/Modify

#### 1. Enhanced Metadata Utilities
**File:** `src/lib/seo/metadata.ts` (NEW)
- Centralized metadata generation
- Environment-aware canonical URLs
- Consistent OG image handling
- Robots directive based on environment

#### 2. Enhanced Sitemap
**File:** `src/app/sitemap.ts` (MODIFY)
- Fetch all static routes
- Fetch all published blog posts from MongoDB
- Fetch all published programs from MongoDB
- Fetch all published tools from MongoDB
- Include `lastModified` from database
- Set appropriate `priority` and `changeFrequency`

#### 3. Enhanced Robots
**File:** `src/app/robots.ts` (MODIFY)
- Check `VERCEL_ENV` or `NODE_ENV`
- Disallow indexing in preview/staging
- Use correct sitemap URL based on environment

#### 4. Canonical Component/Helper
**File:** `src/lib/seo/canonical.ts` (NEW)
- Generate canonical URLs
- Handle trailing slashes
- Handle query parameters (strip or keep)

#### 5. JSON-LD Utilities
**File:** `src/lib/seo/jsonld.ts` (NEW)
- Organization schema
- Article schema (for blog posts)
- BreadcrumbList schema
- WebSite schema with search action

#### 6. Metadata Updates per Route
**Files to modify:**
- `src/app/layout.tsx` - Add canonical, improve OG
- `src/app/inicio/page.tsx` - Add canonical
- `src/app/nosotros/page.tsx` - Add canonical, fix OG URLs
- `src/app/aviso-de-privacidad/page.tsx` - Add canonical, fix OG URLs
- `src/app/blog/page.tsx` - Add canonical, fix OG URLs
- `src/app/programas/page.tsx` - Add canonical, fix OG URLs
- `src/app/herramientas/page.tsx` - Add canonical, fix OG URLs
- `src/app/blog/[slug]/page.tsx` - Add canonical, JSON-LD, improve metadata
- `src/app/programas/[slug]/page.tsx` - Add canonical, JSON-LD, improve metadata
- `src/app/herramientas/[slug]/page.tsx` - Add canonical, JSON-LD, improve metadata

#### 7. Middleware for Environment Protection (Optional)
**File:** `src/middleware.ts` (MODIFY if exists, CREATE if not)
- Add X-Robots-Tag header for non-production
- Handle trailing slashes consistently

---

## G) BLOCKING QUESTIONS

### 1. Environment Variables
**Q:** What is the exact production domain? Is it `democratizamoslanovacion.org` or `www.democratizamoslanovacion.org`?
**Why:** Needed for canonical URLs and sitemap

### 2. Trailing Slashes
**Q:** Do you prefer URLs with trailing slashes (`/inicio/`) or without (`/inicio`)?
**Why:** Affects canonical URLs and sitemap consistency

### 3. Preview/Staging Protection
**Q:** Should preview deployments (Vercel preview URLs) be completely blocked from indexing, or do you want a staging environment that IS indexable?
**Why:** Determines robots.txt and metadata logic

### 4. JSON-LD Schema Priority
**Q:** Which structured data schemas are most important? (Organization, Article, BreadcrumbList, WebSite, etc.)
**Why:** Prioritizes implementation

### 5. OG Images Strategy
**Q:** Do you want dynamic OG images per blog post/program/tool, or use the default `/og/og-default.png` for all?
**Why:** Affects metadata generation and image generation strategy

### 6. Sitemap Update Frequency
**Q:** How often should the sitemap be regenerated? (On-demand, scheduled, or at build time?)
**Why:** Determines if we need ISR or dynamic generation

---

## H) SUMMARY CHECKLIST

### Technical SEO
- ✅ Metadata API implemented
- ✅ OpenGraph tags present
- ⚠️ Twitter cards (partial)
- ❌ Canonical URLs
- ❌ JSON-LD structured data
- ⚠️ Robots.txt (exists but incomplete)
- ❌ Sitemap (only homepage)

### Content SEO
- ✅ Title tags
- ✅ Meta descriptions
- ✅ OG images (but some relative URLs)
- ❌ Article metadata (publishedTime, modifiedTime)
- ❌ Breadcrumbs

### Environment Protection
- ❌ Preview/staging noindex
- ❌ Environment-aware robots
- ❌ X-Robots-Tag headers

### Performance & Best Practices
- ✅ Dynamic metadata generation
- ⚠️ Base URL handling (inconsistent)
- ❌ Sitemap completeness
- ❌ Structured data

---

## NEXT STEPS

1. **Answer blocking questions** (Section G)
2. **Implement canonical URLs** across all pages
3. **Enhance sitemap** to include all routes
4. **Add environment protection** to robots.txt
5. **Implement JSON-LD** for key schemas
6. **Fix OG image URLs** to be absolute
7. **Add missing metadata** (publishedTime, etc.)
8. **Test in production** and verify with Google Search Console

---

**End of Audit Report**
