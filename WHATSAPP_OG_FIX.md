# Fix: WhatsApp/Facebook/LinkedIn Preview - URLs Dinámicas

## 🔍 Problema Identificado

- El sitio carga bien en navegador
- La imagen OG existe y abre bien en Preview
- **Pero WhatsApp no muestra preview** al pegar el link
- En view-source, `og:image` apunta a **OTRO dominio distinto** al que se comparte (deployment URL vs branch URL)

**Causa:** `metadataBase` y URLs de Open Graph estaban hardcodeadas o usaban variables de entorno, no el host real del request.

## ✅ Solución Implementada

### 1. `layout.tsx` - Metadata Dinámico Basado en Headers

**Cambio principal:** Convertido de `export const metadata` estático a `generateMetadata()` dinámico que lee headers del request.

```typescript
export async function generateMetadata(): Promise<Metadata> {
  const h = await headers();
  const host = h.get('x-forwarded-host') ?? h.get('host') ?? 'localhost:3000';
  const proto = h.get('x-forwarded-proto') ?? 'https';
  const base = new URL(`${proto}://${host}`);

  return {
    metadataBase: base,
    openGraph: {
      // URLs absolutas usando el mismo host del request
      url: new URL('/', base).toString(),
      images: [{
        url: new URL('/og/og-default.png', base).toString(),
        // ...
      }],
    },
    twitter: {
      card: 'summary_large_image',
      images: [new URL('/og/og-default.png', base).toString()],
    },
  };
}
```

**Resultado:**
- `og:image` y `og:url` usan el **MISMO host** del request
- En preview: `https://democratizamos-web-git-qa-...vercel.app/og/og-default.png`
- En producción: `https://democratizamoslanovacion.org/og/og-default.png`

### 2. Página `/inicio` - También Actualizada

La página de inicio también usa `generateMetadata()` dinámico para asegurar URLs absolutas consistentes.

## 🧪 Verificación

### Paso 1: Verificar Asset Existe
✅ `public/og/og-default.png` existe y es accesible

### Paso 2: Verificar en Browser
1. Abre el preview deployment: `https://democratizamos-web-git-qa-...vercel.app/inicio`
2. Abre directamente la imagen: `https://democratizamos-web-git-qa-...vercel.app/og/og-default.png`
3. Debe responder **200 OK** y mostrar la imagen

### Paso 3: Verificar Meta Tags en View-Source
1. Abre: `view-source:https://democratizamos-web-git-qa-...vercel.app/inicio`
2. Busca `og:image` (Ctrl+F)
3. **Debe mostrar:** `og:image` con URL del **MISMO dominio** del preview
   ```html
   <meta property="og:image" content="https://democratizamos-web-git-qa-...vercel.app/og/og-default.png" />
   ```
4. **NO debe mostrar:** URL del dominio de producción
   ```html
   <!-- ❌ INCORRECTO -->
   <meta property="og:image" content="https://democratizamoslanovacion.org/og/og-default.png" />
   ```

### Paso 4: Verificar Deployment Protection
1. Ve a Vercel Dashboard → Project Settings → Deployment Protection
2. Verifica que **Preview Deployments** no esté protegido con password
3. Si está protegido, WhatsApp/Facebook bots no podrán acceder
4. **Solución:** Desactivar protección temporalmente o usar método de compartir permitido

### Paso 5: Probar Cache de WhatsApp
WhatsApp cachea por URL exacta. Si ya compartiste antes, prueba con:
- `https://<preview>/inicio?v=2`
- `https://<preview>/inicio?v=3`
- `https://<preview>/inicio?t=1234567890` (timestamp)

## 📋 Checklist de Verificación

- [x] `layout.tsx` usa `generateMetadata()` dinámico
- [x] `metadataBase` se construye desde headers del request
- [x] `og:image` usa URL absoluta con mismo host del request
- [x] `og:url` usa URL absoluta con mismo host del request
- [x] Twitter Card metadata agregado
- [x] Asset `public/og/og-default.png` existe
- [x] Build funciona sin errores
- [ ] Preview deployment muestra meta tags correctos (verificar después de push)
- [ ] WhatsApp muestra preview correctamente (verificar después de push)
- [ ] Facebook Debugger muestra preview correcto (verificar después de push)
- [ ] LinkedIn Inspector muestra preview correcto (verificar después de push)

## 🔧 Headers Utilizados

- `x-forwarded-host`: Proporcionado por Vercel en deployments (preview y producción)
- `host`: Header estándar HTTP
- `x-forwarded-proto`: Proporcionado por Vercel (siempre `https`)

**Fallback:** Si no hay headers, usa `localhost:3000` y `https` (solo en desarrollo local).

## 🚀 Próximos Pasos

1. **Push a la rama QA:**
   ```bash
   git push origin QA
   ```

2. **Esperar deployment en Vercel**

3. **Verificar view-source:**
   - Abre `view-source:https://<preview>/inicio`
   - Confirma que `og:image` usa el mismo dominio del preview

4. **Probar en WhatsApp:**
   - Comparte: `https://<preview>/inicio?v=2`
   - Debe mostrar preview con imagen, título y descripción

5. **Probar en Facebook Debugger:**
   - https://developers.facebook.com/tools/debug/
   - Pega la URL del preview
   - Haz clic en "Scrape Again"
   - Debe mostrar preview correcto

6. **Probar en LinkedIn Inspector:**
   - https://www.linkedin.com/post-inspector/
   - Pega la URL del preview
   - Debe mostrar preview correcto

## ⚠️ Notas Importantes

- **Cache:** WhatsApp, Facebook y LinkedIn cachean los previews. Si ya compartiste antes, usa `?v=2` o similar.
- **Deployment Protection:** Si el preview está protegido con password, los bots no podrán acceder. Desactiva temporalmente para pruebas.
- **Tiempo de respuesta:** La primera vez que WhatsApp scrapea puede tardar unos segundos. Espera y vuelve a intentar.

## 📝 Archivos Modificados

- `src/app/layout.tsx`: Convertido a `generateMetadata()` dinámico
- `src/app/inicio/page.tsx`: Actualizado para usar URLs absolutas
- `src/lib/utils/metadata.ts`: Helper creado (para uso futuro si es necesario)
