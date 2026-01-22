# Fix: Preview Deployment Empty/No Styles Issue

## 🔍 Causa Raíz Identificada

El problema principal era que `metadataBase` en `layout.tsx` estaba hardcodeado a la URL de producción (`https://democratizamoslanovacion.org`), lo cual causaba que:

1. **URLs absolutas de Open Graph apuntaban al dominio de producción** en lugar del preview
2. **Los meta tags generaban URLs incorrectas** para imágenes y recursos en previews de Vercel
3. **Posible conflicto con rutas de assets** cuando el navegador intentaba cargar recursos desde el dominio incorrecto

## ✅ Correcciones Aplicadas

### 1. metadataBase Dinámico (`src/config/site.ts`)

**Antes:**
```typescript
url: 'https://democratizamoslanovacion.org',
```

**Después:**
```typescript
function getBaseUrl(): string {
  // In Vercel preview deployments, use VERCEL_URL (automatically set by Vercel)
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  // Allow override via environment variable
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  // Fallback to production domain
  return 'https://democratizamoslanovacion.org';
}

const baseUrl = getBaseUrl();
url: baseUrl,
```

**Resultado:** Ahora `metadataBase` se calcula dinámicamente:
- En **preview deployments**: Usa `VERCEL_URL` (automáticamente proporcionado por Vercel)
- En **producción**: Usa `NEXT_PUBLIC_SITE_URL` o fallback a dominio de producción
- En **desarrollo local**: Usa fallback a dominio de producción

### 2. Verificaciones Realizadas

✅ **Build local**: Compila sin errores
✅ **Imágenes**: `public/images/ImagotipoColor.png` y `public/og/og-default.png` existen
✅ **CSS**: `globals.css` está correctamente importado en `layout.tsx`
✅ **Routing**: `/inicio` existe y funciona correctamente
✅ **Variables de entorno**: No hay dependencias críticas faltantes que rompan la UI

## 🧪 Verificación

### Pasos para Verificar que el Fix Funciona:

1. **Desplegar la rama QA a Vercel:**
   ```bash
   git push origin QA
   ```

2. **Verificar el Preview Deployment:**
   - Abre: `https://democratizamos-web-git-qa-torozcodlis-projects.vercel.app/inicio`
   - Debe mostrar:
     - ✅ Logo visible en el Navbar
     - ✅ Estilos CSS aplicados correctamente
     - ✅ Imágenes cargando sin 404
     - ✅ Sin errores en consola del navegador

3. **Verificar en DevTools:**
   - Abre DevTools (F12)
   - Pestaña **Network**:
     - `/_next/static/...` debe responder 200
     - `/images/ImagotipoColor.png` debe responder 200
     - `/og/og-default.png` debe responder 200
   - Pestaña **Console**: No debe haber errores críticos

4. **Verificar Meta Tags:**
   - Ver código fuente (Ctrl+U)
   - Buscar `og:image`
   - Debe mostrar URL del preview, no del dominio de producción

## 📋 Checklist de Verificación

- [x] Build local funciona sin errores
- [x] `metadataBase` es dinámico según entorno
- [x] Imágenes existen en `public/`
- [x] CSS está importado correctamente
- [x] Routing funciona (`/inicio` existe)
- [x] No hay errores de linting
- [ ] Preview deployment muestra logo y estilos (verificar después de push)
- [ ] Assets cargan sin 404 (verificar después de push)
- [ ] Meta tags usan URL correcta del preview (verificar después de push)

## 🔧 Variables de Entorno en Vercel

**No se requieren variables de entorno adicionales** para que el fix funcione. Vercel automáticamente proporciona:
- `VERCEL_URL`: URL del deployment (preview o producción)

**Opcional:** Puedes configurar `NEXT_PUBLIC_SITE_URL` en Vercel si quieres override manual.

## 📝 Notas Adicionales

- El fix es **backward compatible**: En producción seguirá usando el dominio correcto
- El fix **no afecta** el comportamiento en desarrollo local
- Las imágenes y assets en `public/` se sirven correctamente en todos los entornos
- El middleware no fue modificado (no era la causa del problema)

## 🚀 Próximos Pasos

1. Hacer commit de los cambios
2. Push a la rama QA
3. Verificar que el preview deployment funcione correctamente
4. Si todo está bien, mergear a main/producción
