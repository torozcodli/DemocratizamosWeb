# Implementación de PostHog Analytics

## Resumen

Se ha implementado PostHog Analytics en el proyecto Next.js (App Router) con enfoque en rendimiento y control. La implementación incluye:

- ✅ Instalación de `posthog-js`
- ✅ Provider único para inicialización
- ✅ Captura manual de pageviews en App Router
- ✅ Helper para eventos personalizados
- ✅ Instrumentación de eventos clave

## Archivos Modificados/Creados

### Nuevos archivos:
1. **`src/components/providers/PostHogProvider.tsx`**
   - Provider client-side que inicializa PostHog una sola vez
   - Componente interno `PostHogPageView` que captura pageviews usando `usePathname()` y `useSearchParams()`
   - Configuración: `autocapture: false`, `capture_pageview: false`
   - No inicializa si faltan env vars (no rompe la app)

2. **`src/lib/analytics.ts`**
   - Helper client-safe para tracking de eventos
   - Funciones: `track(event, properties)` y `identify(userId, properties)`
   - Validación robusta de inicialización

### Archivos modificados:
1. **`src/app/layout.tsx`**
   - Integrado `PostHogProvider` en la cadena de providers
   - Orden: `SessionProvider` → `ThemeProvider` → `PostHogProvider`

2. **`src/components/sections/NavbarMenu.client.tsx`**
   - Instrumentado evento `cta_click` para clicks en "Programas" y "Herramientas"
   - Tracking en versión desktop y mobile
   - Propiedades: `{ cta: 'Programas'|'Herramientas', location: 'navbar'|'navbar_mobile' }`

3. **`src/components/sections/Footer.tsx`**
   - Instrumentado evento `footer_click` para click en "Aviso de privacidad"
   - Propiedades: `{ item: 'aviso_privacidad' }`

4. **`src/components/sections/Contact.tsx`**
   - Instrumentado evento `contact_form_submit` al enviar formulario
   - Propiedades: `{ location: 'contact_section' }`

5. **`package.json`**
   - Agregada dependencia: `posthog-js`

## Configuración de Variables de Entorno

### Local (.env.local)

Agregar las siguientes variables:

```env
NEXT_PUBLIC_POSTHOG_KEY=phc_RMcFLtSsBnZ8CUEGOYSVRW3GgtOF1e12trDNt74q3Sm
NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
```

### Vercel (Production/Preview)

1. Ir a **Project Settings** → **Environment Variables**
2. Agregar:
   - `NEXT_PUBLIC_POSTHOG_KEY` = `phc_RMcFLtSsBnZ8CUEGOYSVRW3GgtOF1e12trDNt74q3Sm`
   - `NEXT_PUBLIC_POSTHOG_HOST` = `https://app.posthog.com`
3. Aplicar a: **Production**, **Preview**, y **Development** (si aplica)
4. **Redeploy** después de agregar las variables

## Verificación

### Local

1. **Configurar env vars:**
   ```bash
   # Crear/editar .env.local
   NEXT_PUBLIC_POSTHOG_KEY=phc_RMcFLtSsBnZ8CUEGOYSVRW3GgtOF1e12trDNt74q3Sm
   NEXT_PUBLIC_POSTHOG_HOST=https://app.posthog.com
   ```

2. **Iniciar servidor:**
   ```bash
   npm run dev
   ```

3. **Verificar en consola del navegador:**
   - Abrir DevTools → Console
   - Deberías ver: `[PostHog] Initialized successfully` (solo en desarrollo)

4. **Navegar entre páginas:**
   - `/inicio`
   - `/programas`
   - `/nosotros`
   - `/herramientas`
   - Verificar en PostHog Live Events que se capturan eventos `$pageview` con `$current_url`

5. **Probar eventos personalizados:**
   - Click en "Programas" en navbar → Ver evento `cta_click` con `{ cta: 'Programas', location: 'navbar' }`
   - Click en "Herramientas" en navbar → Ver evento `cta_click` con `{ cta: 'Herramientas', location: 'navbar' }`
   - Click en "Aviso de privacidad" en footer → Ver evento `footer_click` con `{ item: 'aviso_privacidad' }`
   - Enviar formulario de contacto → Ver evento `contact_form_submit` con `{ location: 'contact_section' }`

### Vercel (Preview/Production)

1. **Verificar env vars en Vercel Dashboard**
2. **Hacer deploy** (o esperar a que se active automáticamente)
3. **Abrir la URL de preview/production**
4. **Verificar en PostHog:**
   - Ir a **Live Events** en PostHog Dashboard
   - Navegar por el sitio y verificar que aparecen eventos
   - Filtrar por eventos: `$pageview`, `cta_click`, `footer_click`, `contact_form_submit`

## Eventos Capturados

| Evento | Descripción | Propiedades |
|--------|-------------|-------------|
| `$pageview` | Navegación entre páginas | `$current_url` |
| `cta_click` | Click en CTAs principales | `cta`: 'Programas'\|'Herramientas'<br>`location`: 'navbar'\|'navbar_mobile' |
| `footer_click` | Click en links del footer | `item`: 'aviso_privacidad' |
| `contact_form_submit` | Envío de formulario de contacto | `location`: 'contact_section' |

## Notas Importantes

### Privacidad y Cookie Consent

⚠️ **IMPORTANTE**: Si en el futuro se implementa un sistema de cookie consent:

1. **NO inicializar PostHog hasta que el usuario acepte analíticas**
2. Modificar `PostHogProvider` para esperar el consentimiento:
   ```tsx
   // Ejemplo conceptual
   const hasConsent = useCookieConsent();
   if (!hasConsent) {
     return <>{children}</>;
   }
   ```
3. El helper `track()` ya maneja el caso donde PostHog no está inicializado (no rompe la app)

### Performance

- ✅ PostHog se inicializa solo una vez (singleton)
- ✅ No hay autocapture (mejor performance)
- ✅ Pageviews manuales (más control)
- ✅ No se inicializa si faltan env vars (no rompe en desarrollo)

### Debugging

En desarrollo, los warnings/errores aparecen en la consola:
- `[PostHog] Missing environment variables. Analytics disabled.` → Faltan env vars
- `[Analytics] PostHog not initialized. Event "X" not tracked.` → PostHog no está listo aún
- `[PostHog] Initialized successfully` → Todo OK

## Troubleshooting

### No aparecen eventos en PostHog

1. **Verificar env vars:**
   - En local: revisar `.env.local`
   - En Vercel: revisar Project Settings → Environment Variables
   - Asegurarse de que las variables empiezan con `NEXT_PUBLIC_`

2. **Verificar en consola:**
   - Abrir DevTools → Console
   - Buscar mensajes de PostHog
   - Si hay errores, revisar la red (Network tab) para ver requests a PostHog

3. **Verificar que PostHog está inicializado:**
   - En consola del navegador: `window.posthog` debería existir
   - `window.posthog.__loaded` debería ser `true`

4. **Verificar en PostHog Dashboard:**
   - Ir a **Settings** → **Project API Key** → Verificar que la key es correcta
   - Verificar que el proyecto está activo

### Eventos duplicados

- Si ves eventos duplicados, verificar que no hay múltiples instancias de `PostHogProvider`
- El provider debe estar solo en `layout.tsx` (root)

### Pageviews no se capturan

- Verificar que `PostHogPageView` está dentro de `PostHogProvider`
- Verificar que `usePathname()` y `useSearchParams()` funcionan (App Router)
- Revisar consola por errores

## Próximos Pasos (Opcional)

1. **Agregar más eventos:**
   - Scroll depth
   - Time on page
   - Clicks en otros CTAs
   - Downloads de recursos

2. **User identification:**
   - Si hay login, usar `identify()` cuando el usuario se autentica
   - Ejemplo: `identify(userId, { email, name })`

3. **Feature flags:**
   - PostHog soporta feature flags
   - Útil para A/B testing

4. **Session recording:**
   - Opcional: habilitar session recording para debugging
   - Requiere consentimiento explícito del usuario
