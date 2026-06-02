# Demoinn → Suma Consumer Initial Audit

**Fecha:** 2026-06-01  
**Auditor:** Claude Code (claude-sonnet-4-6)  
**Branch:** ApiSuma  
**Alcance:** Consumo de la API pública lite de Suma Impacto desde Demoinn

---

## 1. Resumen ejecutivo

### Estado general

El proyecto Demoinn ya tiene una integración inicial con Suma Impacto en producción bajo `src/modules/suma-impacto/`. La arquitectura base es **correcta** en su forma: client server-only, ISR caching, adapter con tests. Sin embargo, hay **un defecto de seguridad P0 activo** y varios P1 que deben corregirse antes de considerar esta integración completa y lista para mantener.

### Veredicto

> **No está listo para cerrar.** La integración funciona en modo optimista pero viola el contrato oficial de autenticación y carece de validación Zod del response, timeout, y cobertura de tests adecuada.

### Listo para implementar (fase siguiente)

**No.** Los P0 y P1 deben resolverse primero.

### Conteo de hallazgos abiertos

| Prioridad | Cantidad |
|-----------|----------|
| P0        | 1        |
| P1        | 4        |
| P2        | 6        |
| P3        | 5        |

### Riesgos principales

1. API key de Suma Impacto expuesta en URLs y potencialmente en logs de red/CDN.
2. Sin timeout: el server component puede quedar colgado si Suma no responde.
3. Sin validación Zod del response: campos inesperados o ausentes llegan silenciosamente al frontend.
4. Contrato de campos incompleto: `cost`, `organizationName`, `costLabel` no mapeados.
5. Tests insuficientes: solo se prueba el adapter; client, env y schema no tienen cobertura.

### Recomendación

Corregir P0 y P1 en el orden del plan de implementación por fases al final de este documento. No avanzar a nuevas features de consumo hasta cerrar esos hallazgos.

---

## 2. Mapa del proyecto

### Framework y stack

| Aspecto | Detalle |
|---------|---------|
| Framework | Next.js 16 (App Router, Turbopack) |
| Runtime | React 19 + TypeScript 5.9 strict |
| ORM | Mongoose 9 sobre MongoDB |
| Auth | NextAuth 4 (JWT, sin DB adapter) |
| Validación | Zod 4 |
| i18n | next-intl 4 (ES/EN) |
| Imágenes | Cloudinary + Next/Image |
| Analytics | PostHog |
| Tests | Vitest 4 (Node environment) |
| Estilos | Tailwind CSS 4 |

### Estructura relevante al consumo de Suma

```
src/
├── modules/
│   └── suma-impacto/               ← MÓDULO EXISTENTE
│       ├── types.ts                  DTOs de entrada (Suma) y salida (Demoinn)
│       ├── env.ts                    Validación Zod de env vars (server-only)
│       ├── client.ts                 Fetch wrapper ISR (server-only)
│       ├── adapter.ts                Mapper DTO externo → DTO interno
│       └── adapter.test.ts           Tests unitarios del adapter (Vitest)
├── app/
│   └── [locale]/
│       └── programas/
│           └── page.tsx              Server Component — consume getSumaImpactoExperiences()
├── components/
│   └── sections/
│       └── programas/
│           └── ProgramasProyectosSection.tsx  Client Component — carrusel de cards
└── .env.example                      Documenta vars: SUMA_IMPACTO_*
```

### Dónde viven las piezas clave

| Pieza | Ruta | Tipo |
|-------|------|------|
| Env validation | `src/modules/suma-impacto/env.ts` | server-only |
| HTTP client | `src/modules/suma-impacto/client.ts` | server-only |
| DTOs / types | `src/modules/suma-impacto/types.ts` | shared (no secrets) |
| Adapter / mapper | `src/modules/suma-impacto/adapter.ts` | pure function |
| Tests | `src/modules/suma-impacto/adapter.test.ts` | vitest |
| Consumer (Server) | `src/app/[locale]/programas/page.tsx` | Server Component |
| Consumer (Client) | `src/components/sections/programas/ProgramasProyectosSection.tsx` | Client Component (recibe props) |
| Env example | `.env.example` | docs |

---

## 3. Consumo actual de APIs externas

| Servicio | Archivo | Server/Client | Auth | Env vars | Timeout | Cache | Errores | Schema validation | Riesgo |
|----------|---------|--------------|------|----------|---------|-------|---------|------------------|--------|
| Suma Impacto | `modules/suma-impacto/client.ts` | Server-only ✅ | Query param `api_key` ❌ | `SUMA_IMPACTO_*` ✅ | Ninguno ❌ | ISR 1800s ✅ | Fallback vacío ✅ | Manual (no Zod) ⚠️ | **P0 + P1** |
| MongoDB | `lib/mongoose.ts`, `lib/mongodb.ts` | Server-only ✅ | `MONGODB_URI` ✅ | `MONGODB_URI` ✅ | Pool config ✅ | Mongoose cache ✅ | Try/catch ✅ | Mongoose schema ✅ | Bajo |
| Cloudinary | `lib/cloudinary.ts`, `api/admin/upload/route.ts` | Server-only ✅ | `api_key` en body (SDK) ✅ | `CLOUDINARY_API_*` ✅ | SDK default | N/A | Try/catch ✅ | N/A | Bajo |
| NextAuth/Google | `lib/auth.ts` | Server-only ✅ | OAuth 2.0 ✅ | `GOOGLE_ID/SECRET` ✅ | SDK default | JWT ✅ | NextAuth maneja ✅ | N/A | Bajo |
| PostHog | `lib/analytics.ts` | Client-side ✅ | `NEXT_PUBLIC_POSTHOG_KEY` ✅ | `NEXT_PUBLIC_POSTHOG_KEY` ✅ | SDK default | N/A | Guard de ready ✅ | N/A | Bajo |

### Patrón de fetch existente en componentes admin (client-side)

Los componentes admin (`AdminProgramsList`, `AdminBlogsList`, etc.) usan fetch directo hacia rutas internas `/api/admin/*`. Esto es correcto porque esas rutas son internas — no cruzan hacia servicios externos y están protegidas por auth de NextAuth.

### Observación sobre patrón HTTP

No existe un cliente HTTP centralizado reutilizable para llamadas externas (tipo `apiFetch` genérico). La única llamada externa estructurada es la de Suma Impacto. Si en el futuro se agregan más integraciones externas, convendrá crear un cliente base genérico.

---

## 4. Punto recomendado de integración con Suma

La integración ya existe y el punto de integración elegido es correcto:

```
ProgramasPage (Server Component)
  └── getProgramasExperienceCardsSafe()
        └── getSumaImpactoExperiences()   ← fetch a Suma (server, ISR)
              └── adaptSumaExperiencesToCards()  ← mapper
  └── <ProgramasProyectosSection items={cards} />  ← client, solo recibe datos
```

**Veredicto de arquitectura:** ✅ Correcto en estructura. La API key nunca llega al cliente. El componente client no hace fetch directamente. Los datos pasan como props ya transformados.

**Lo que debe corregirse** no es el patrón sino los defectos internos del client y el schema.

---

## 5. Hallazgos P0

### P0-001 — API key enviada como query parameter en vez de header HTTP

| | |
|---|---|
| **Prioridad** | P0 |
| **Archivo** | `src/modules/suma-impacto/client.ts:73` |
| **Problema** | La API key se envía como `?api_key=<key>` en la URL en vez de como header `x-api-key: <key>` |
| **Riesgo** | Crítico. La API key queda embebida en la URL, que puede aparecer en: logs del servidor de Suma, logs de CDN/proxy intermedios, `Referer` headers en redirecciones, y como parte de la cache key de Next.js ISR. Viola el contrato oficial del endpoint. |
| **Evidencia** | `url.searchParams.set('api_key', experiencesApiKey);` — line 73 |
| **Contrato oficial** | `x-api-key: <EXPERIENCES_API_KEY>` (header HTTP obligatorio) |

**Recomendación:**

Reemplazar `url.searchParams.set('api_key', ...)` por un header `x-api-key` en el objeto `headers` del fetch. La URL no debe contener la key.

**Fix sugerido en `client.ts`:**

```ts
// ANTES (incorrecto):
url.searchParams.set('api_key', experiencesApiKey);
// ...
response = await fetch(url.toString(), {
  next: { revalidate: REVALIDATE_SECONDS },
  headers: { Accept: 'application/json' },
});

// DESPUÉS (correcto):
// No agregar api_key a la URL. Solo source como query param.
url.searchParams.set('source', source);

response = await fetch(url.toString(), {
  next: { revalidate: REVALIDATE_SECONDS },
  headers: {
    Accept: 'application/json',
    'x-api-key': experiencesApiKey,
  },
});
```

**Tests necesarios:**

- Verificar que el request incluye header `x-api-key` con el valor correcto.
- Verificar que la URL resultante NO contiene `api_key` como query param.
- Verificar que `source=demoinn` sí está en la URL.

---

## 6. Hallazgos P1

### P1-001 — Ausencia de timeout en fetch

| | |
|---|---|
| **Prioridad** | P1 |
| **Archivo** | `src/modules/suma-impacto/client.ts:78-84` |
| **Problema** | El fetch a Suma no tiene timeout configurado. No se usa `AbortController` ni señal de cancelación. |
| **Riesgo** | Si Suma no responde o responde muy lento, el server component puede quedar colgado por el tiempo que defina el timeout de Vercel/Node (puede ser hasta 30s). Esto bloquea el render de `/programas` para todos los usuarios durante ese tiempo. En ISR esto impacta la revalidación. |
| **Evidencia** | `response = await fetch(url.toString(), { next: { revalidate: REVALIDATE_SECONDS }, headers: { Accept: 'application/json' } });` — sin `signal`. |

**Recomendación:**

Usar `AbortController` con un timeout configurable via `SUMA_API_TIMEOUT_MS` (default razonable: 8000ms).

**Fix sugerido:**

```ts
const timeoutMs = getSumaImpactoEnv().timeoutMs; // nuevo campo opcional en env

const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), timeoutMs);

try {
  response = await fetch(url.toString(), {
    signal: controller.signal,
    next: { revalidate: REVALIDATE_SECONDS },
    headers: {
      Accept: 'application/json',
      'x-api-key': experiencesApiKey,
    },
  });
} catch (err) {
  if (err instanceof Error && err.name === 'AbortError') {
    logDev('Experiences request timed out', { timeoutMs });
  } else {
    logDev('Network error while fetching experiences');
  }
  return { ...FALLBACK };
} finally {
  clearTimeout(timer);
}
```

**Tests necesarios:**

- Verificar que el AbortController se dispara a los Xms.
- Verificar que el fallback se devuelve en timeout.
- Verificar que el timer se limpia en respuesta exitosa.

---

### P1-002 — Sin validación Zod del response de Suma

| | |
|---|---|
| **Prioridad** | P1 |
| **Archivo** | `src/modules/suma-impacto/client.ts:18-44`, `src/modules/suma-impacto/types.ts` |
| **Problema** | La validación del response es manual (`normalizeBody()`). Los items del array se castean directamente: `rawData.filter(isRecord) as SumaImpactoLiteExperience[]`. No hay validación en runtime del shape de cada item. Campos faltantes o de tipo incorrecto pasan silenciosamente al adapter. |
| **Riesgo** | Si Suma cambia el contrato o devuelve campos de tipo incorrecto, el adapter puede fallar silenciosamente o devolver datos corruptos al frontend. No hay defensa ante cambios de contrato en runtime. |
| **Evidencia** | `const data = rawData.filter(isRecord) as SumaImpactoLiteExperience[];` — cast sin validación. `SumaImpactoLiteExperience` es solo TypeScript, no Zod. |

**Recomendación:**

Crear `sumaExperience.schema.ts` con un schema Zod del item lite. Usar `z.array(itemSchema)` para validar el array. Loguear (no lanzar) items que no pasen el schema.

**Fix sugerido — nuevo archivo `src/modules/suma-impacto/schema.ts`:**

```ts
import 'server-only';
import { z } from 'zod';

export const sumaImpactoLiteItemSchema = z.object({
  id: z.string().optional(),
  name: z.string().optional(),
  types: z.array(z.string()).optional(),
  description: z.string().optional(),
  startDate: z.string().optional(),
  endDate: z.string().optional(),
  closingDate: z.string().optional(),
  organization: z.string().optional(),
  organizationSlug: z.string().optional(),
  location: z.string().nullable().optional(),
  modality: z.string().nullable().optional(),
  imageUrl: z.string().nullable().optional(),
  registrationUrl: z.string().optional(),
  reserveUrl: z.string().optional(),
  shortLinkUrl: z.string().nullable().optional(),
  cost: z.string().nullable().optional(),
  publicUrl: z.string().optional(),
}).passthrough(); // Campos extra de Suma no rompen

export const sumaImpactoLiteResponseSchema = z.object({
  success: z.literal(true),
  total: z.number().int().min(0),
  data: z.array(sumaImpactoLiteItemSchema),
});

export type SumaImpactoLiteItemFromSchema = z.infer<typeof sumaImpactoLiteItemSchema>;
export type SumaImpactoLiteResponseFromSchema = z.infer<typeof sumaImpactoLiteResponseSchema>;
```

**Tests necesarios:**

- Response válido pasa el schema.
- Response sin campos opcionales pasa.
- Response con `success: false` falla.
- Response con `data` no array falla.
- Response con campos extra no rompe (`.passthrough()`).
- Item malformado (type incorrecto en campo) falla a nivel item.

---

### P1-003 — Validación de API key insuficiente en env.ts

| | |
|---|---|
| **Prioridad** | P1 |
| **Archivo** | `src/modules/suma-impacto/env.ts:21-23` |
| **Problema** | `SUMA_IMPACTO_EXPERIENCES_API_KEY` solo requiere `min(1)`. Una key de 1 carácter pasaría la validación. No hay validación de longitud mínima real. |
| **Riesgo** | Un error de configuración (key truncada, placeholder dejado) no se detecta en startup. La llamada a Suma fallaría con 401 en runtime, pero sin señal temprana de configuración incorrecta. |
| **Evidencia** | `SUMA_IMPACTO_EXPERIENCES_API_KEY: z.string().min(1, 'SUMA_IMPACTO_EXPERIENCES_API_KEY is required')` |

**Recomendación:**

Agregar `min(32)` para detectar keys claramente incompletas. El estándar del proyecto Suma usa keys de 64+ caracteres.

**Fix sugerido:**

```ts
SUMA_IMPACTO_EXPERIENCES_API_KEY: z
  .string()
  .min(32, 'SUMA_IMPACTO_EXPERIENCES_API_KEY must be at least 32 characters'),
```

**Tests necesarios:**

- Key de 31 chars falla validación.
- Key de 32+ chars pasa.
- Key vacía falla.

---

### P1-004 — orgId sin validación de formato

| | |
|---|---|
| **Prioridad** | P1 |
| **Archivo** | `src/modules/suma-impacto/env.ts:24` |
| **Problema** | `SUMA_IMPACTO_DEMOINN_ORG_ID` solo requiere `min(1)`. No valida que sea un MongoDB ObjectId válido (24 caracteres hex) ni cualquier otro formato esperado. |
| **Riesgo** | Un orgId malformado generaría 404 silencioso de Suma, devolviendo la lista vacía sin señal de error de configuración. El operador no sabría que hay un error de configuración vs. que genuinamente no hay experiencias. |
| **Evidencia** | `SUMA_IMPACTO_DEMOINN_ORG_ID: z.string().min(1, 'SUMA_IMPACTO_DEMOINN_ORG_ID is required')` |

**Recomendación:**

Agregar `.regex(/^[a-f0-9]{24}$/i)` para MongoDB ObjectId o adaptar al formato real del orgId de Suma. Si el formato no es ObjectId, al menos `min(8)` para detectar valores claramente erróneos.

**Fix sugerido (si es MongoDB ObjectId):**

```ts
SUMA_IMPACTO_DEMOINN_ORG_ID: z
  .string()
  .regex(/^[a-f0-9]{24}$/i, 'SUMA_IMPACTO_DEMOINN_ORG_ID must be a valid 24-char hex ObjectId'),
```

**Tests necesarios:**

- ObjectId válido pasa.
- String corto falla.
- String con caracteres inválidos falla.
- String vacío falla.

---

## 7. Hallazgos P2

### P2-001 — `docs/api/DEMOINN_EXPERIENCES_API.md` no existe

| | |
|---|---|
| **Prioridad** | P2 |
| **Problema** | El contrato oficial del endpoint (`GET /api/experiences/org/{orgId}/lite?source=demoinn`) no está documentado en el proyecto Demoinn. El directorio `docs/` no existe. |
| **Riesgo** | Cualquier desarrollador que trabaje en esta integración necesita el contrato para saber exactamente qué campos esperar, qué autenticación usar, y qué comportamientos asumir. Sin el doc, hay drift vs. el contrato real de Suma. |
| **Recomendación** | Crear `docs/api/DEMOINN_EXPERIENCES_API.md` copiando el contrato oficial aprobado en Suma. Este documento es el source of truth de la integración. |

---

### P2-002 — Campo `cost` faltante en types y adapter

| | |
|---|---|
| **Prioridad** | P2 |
| **Archivo** | `src/modules/suma-impacto/types.ts`, `src/modules/suma-impacto/adapter.ts` |
| **Problema** | El contrato oficial incluye el campo `cost` (información del costo de la experiencia). `SumaImpactoLiteExperience` no define `cost`. `DemocratizamosExperienceCard` no tiene `costLabel`. El adapter no mapea ni transforma costo. |
| **Riesgo** | Información relevante para el usuario final (si la experiencia es gratuita o de pago) no llega a las cards. |
| **Recomendación** | Agregar `cost?: string \| null` a `SumaImpactoLiteExperience`. Agregar `costLabel?: string` a `DemocratizamosExperienceCard`. El adapter debe transformar `cost` a un label legible. |

---

### P2-003 — `organizationName` no presente en DTO interno

| | |
|---|---|
| **Prioridad** | P2 |
| **Archivo** | `src/modules/suma-impacto/types.ts`, `src/modules/suma-impacto/adapter.ts` |
| **Problema** | El contrato oficial incluye `organization` (nombre de la organización). `SumaImpactoLiteExperience` tiene `organization?: string` pero `DemocratizamosExperienceCard` no lo expone. Las cards no pueden mostrar el nombre de la organización que oferta la experiencia. |
| **Riesgo** | Dato de atribución ausente en UI. Relevante si Demoinn muestra experiencias de múltiples organizaciones. |
| **Recomendación** | Agregar `organizationName?: string` a `DemocratizamosExperienceCard` y mapear desde `item.organization` en el adapter. |

---

### P2-004 — TTL de cache hardcodeado, sin soporte de `SUMA_API_CACHE_TTL_SECONDS`

| | |
|---|---|
| **Prioridad** | P2 |
| **Archivo** | `src/modules/suma-impacto/client.ts:12` |
| **Problema** | `const REVALIDATE_SECONDS = 1800;` está hardcodeado. No hay soporte para `SUMA_API_CACHE_TTL_SECONDS` env var. No se puede ajustar el TTL sin modificar código. |
| **Riesgo** | En producción, si las experiencias cambian con frecuencia, el TTL de 30 minutos puede ser demasiado largo. No hay mecanismo de ajuste sin deploy. |
| **Recomendación** | Agregar `SUMA_API_CACHE_TTL_SECONDS` opcional al schema de env con default 1800 y rango seguro (60–3600). Usar el valor en `revalidate`. |

---

### P2-005 — Sin soporte de `SUMA_API_TIMEOUT_MS`

| | |
|---|---|
| **Prioridad** | P2 (relacionado con P1-001) |
| **Archivo** | `src/modules/suma-impacto/env.ts`, `src/modules/suma-impacto/client.ts` |
| **Problema** | No existe soporte para timeout configurable. El P1-001 ya cubre la ausencia de timeout, pero además el timeout debería ser configurable como env var. |
| **Recomendación** | Agregar `SUMA_API_TIMEOUT_MS` opcional al schema de env con default 8000 y rango seguro (1000–30000). |

---

### P2-006 — `logDev` usa `console.error` para mensajes que no son errores

| | |
|---|---|
| **Prioridad** | P2 |
| **Archivo** | `src/modules/suma-impacto/client.ts:46-53` |
| **Problema** | `logDev` siempre usa `console.error` incluso para mensajes informativos como "Network error while fetching experiences". Esto contamina el output de errores en desarrollo. Solo se registra en dev, pero el nivel de log es incorrecto. |
| **Recomendación** | Usar `console.warn` para situaciones de degradación controlada (network error, 404, timeout) y `console.error` solo para errores no esperados. |

---

## 8. Hallazgos P3

### P3-001 — Naming de env vars difiere del contrato especificado

| | |
|---|---|
| **Prioridad** | P3 |
| **Archivo** | `.env.example`, `src/modules/suma-impacto/env.ts` |
| **Problema** | Las variables de entorno usan el prefijo `SUMA_IMPACTO_*` en vez del prefijo `SUMA_*` definido en el contrato inicial (`SUMA_API_BASE_URL`, `SUMA_EXPERIENCES_API_KEY`, `SUMA_DEMOINN_ORG_ID`). |
| **Riesgo** | Confusión si la documentación de Suma referencia los nombres del contrato y el código usa nombres diferentes. Ambigüedad en operaciones. |
| **Recomendación** | Documentar explícitamente el naming elegido (`SUMA_IMPACTO_*`) en `docs/api/DEMOINN_EXPERIENCES_API.md` y actualizar el contrato de Suma si es necesario. No requiere cambio en código si el naming `SUMA_IMPACTO_*` fue una decisión intencional. |

---

### P3-002 — Tests del adapter incompletos para casos de seguridad

| | |
|---|---|
| **Prioridad** | P3 |
| **Archivo** | `src/modules/suma-impacto/adapter.test.ts` |
| **Problema** | `stripHtmlForCardDescription` tiene solo 1 test case. No hay tests para: script injection (`<script>alert(1)</script>`), style injection, HTML de múltiples niveles de anidado, entidades HTML complejas, strings con solo HTML (resultado vacío). |
| **Recomendación** | Agregar tests de edge cases de seguridad para `stripHtmlForCardDescription`. |

---

### P3-003 — No existen tests para client, env, schema

| | |
|---|---|
| **Prioridad** | P3 |
| **Archivos** | `src/modules/suma-impacto/client.ts`, `src/modules/suma-impacto/env.ts` |
| **Problema** | Solo el adapter tiene tests. El client, el env validator y (cuando se cree) el schema Zod no tienen tests. |
| **Recomendación** | Ver sección 15 de este documento para el plan de tests completo. |

---

### P3-004 — `DemocratizamosExperienceCard` fusiona `location` y `modality`

| | |
|---|---|
| **Prioridad** | P3 |
| **Archivo** | `src/modules/suma-impacto/adapter.ts:51-56`, `src/modules/suma-impacto/types.ts` |
| **Problema** | El campo `location` del DTO interno fusiona `location || modality || fallback`. Se pierde la distinción semántica entre ubicación física y modalidad (online/presencial). |
| **Riesgo** | Bajo en este momento. Puede limitar futuras mejoras de UI que distingan "Online" de "CDMX". |
| **Recomendación** | Considerar agregar `modality?: string` separado a `DemocratizamosExperienceCard` en una iteración futura. No es bloqueante. |

---

### P3-005 — Env cache puede retener valores stale en hot reload de desarrollo

| | |
|---|---|
| **Prioridad** | P3 |
| **Archivo** | `src/modules/suma-impacto/env.ts:40-42` |
| **Problema** | `let cached: SumaImpactoServerEnv | null = null;` puede retener el valor inicial en hot reload de desarrollo si el módulo no se reinicia. Cambiando una env var en `.env.local`, el cache puede no reflejarlo sin reiniciar el servidor. |
| **Riesgo** | Solo afecta DX en desarrollo. No es un problema en producción (cold start). |
| **Recomendación** | Documentar en comentario que el cache es intencional y que en dev se requiere reiniciar el servidor para reflejar cambios de env. No requiere cambio en código. |

---

## 9. Seguridad

### Checklist de seguridad

| Riesgo | Estado | Severidad |
|--------|--------|-----------|
| API key de Suma expuesta al frontend | ✅ No expuesta (server-only) | — |
| `NEXT_PUBLIC_*` para secretos | ✅ No se usa | — |
| Fetch directo a Suma desde componente client | ✅ No existe (props passing) | — |
| API key en URL query param | ❌ **SÍ, activo** | P0 |
| Base URL manipulable por usuario | ✅ Viene de env, no de input | — |
| orgId manipulable por usuario | ✅ Viene de env, no de input | — |
| Logs que imprimen API key | ✅ `logDev` no imprime la key | — |
| Errores de Suma propagados al cliente | ✅ Solo fallback vacío | — |
| SSRF potencial | ✅ Base URL viene de env validado | — |
| Uso de campos no documentados | ⚠️ Parcial (`cost` no mapeado) | P2 |
| Ausencia de timeout | ❌ **SÍ, activo** | P1 |
| Ausencia de validación Zod del response | ❌ **SÍ, activo** | P1 |
| `any` o JSON sin schema en frontera externa | ⚠️ Cast sin Zod | P1 |
| Cache con datos sensibles | ✅ Solo datos públicos | — |
| Retry agresivo | ✅ Sin retry (correcto) | — |
| HTML injection desde Suma | ✅ `stripHtmlForCardDescription` | — |

### Postura de seguridad general

La base arquitectónica es segura. La API key nunca sale del servidor. Los datos de Suma son públicos (no PII). El único P0 activo es el modo de transmisión de la key (query param vs. header). Los P1 de validación y timeout son defectos de robustez, no de confidencialidad.

---

## 10. Validaciones

### Variables de entorno — estado actual vs. requerido

| Variable | Validación actual | Requerida | Estado |
|----------|------------------|-----------|--------|
| `SUMA_IMPACTO_BASE_URL` | URL válida http(s) ✅ | URL válida http(s) | ✅ OK |
| `SUMA_IMPACTO_EXPERIENCES_API_KEY` | `min(1)` ⚠️ | `min(32)` | ❌ P1-003 |
| `SUMA_IMPACTO_DEMOINN_ORG_ID` | `min(1)` ⚠️ | regex ObjectId o formato controlado | ❌ P1-004 |
| `SUMA_IMPACTO_EXPERIENCES_SOURCE` | default 'demoinn' ✅ | default 'demoinn' | ✅ OK |
| `SUMA_API_TIMEOUT_MS` | No existe | Opcional, rango 1000–30000 | ❌ P2-005 |
| `SUMA_API_CACHE_TTL_SECONDS` | No existe | Opcional, rango 60–3600 | ❌ P2-004 |

### Response de Suma — estado actual vs. requerido

El contrato oficial del response es:

```json
{
  "success": true,
  "data": [PublicExperienceLiteItem],
  "total": number
}
```

| Campo validado | Validación actual | Estado |
|---------------|------------------|--------|
| `success === true` | Manual en `normalizeBody()` ✅ | Parcial (no Zod) |
| `total` numérico | Manual en `normalizeBody()` ✅ | Parcial |
| `data` array | Manual en `normalizeBody()` ✅ | Parcial |
| Shape de cada item | Cast directo, sin validación ❌ | P1-002 |
| `cost` en item | No existe en types ❌ | P2-002 |
| Campos extra del response | No se sanitizan (pasan al adapter) | ⚠️ |

### Errores de Suma — cobertura actual

| Código / Error | Manejo actual | Estado |
|---------------|---------------|--------|
| 200 OK | Procesa response ✅ | OK |
| 401 Unauthorized | `!response.ok` → FALLBACK ✅ | OK (podría loguear diferenciado) |
| 400 Bad Request | `!response.ok` → FALLBACK ✅ | OK |
| 403 Forbidden | `!response.ok` → FALLBACK ✅ | OK |
| 404 Not Found | `!response.ok` → FALLBACK ✅ | OK |
| 500 Server Error | `!response.ok` → FALLBACK ✅ | OK |
| Timeout | Sin AbortController → cuelga ❌ | P1-001 |
| Network error | `catch` → FALLBACK ✅ | OK |
| JSON malformado | `JSON.parse` catch → FALLBACK ✅ | OK |
| Response vacía | `isRecord` check → FALLBACK ✅ | OK |

---

## 11. Arquitectura recomendada

### Estructura actual (ya existe)

```
src/modules/suma-impacto/
├── types.ts          ← DTOs (ampliar con cost, organizationName)
├── env.ts            ← Env validation (server-only) — corregir validaciones
├── client.ts         ← Fetch wrapper (server-only) — corregir header + timeout
├── adapter.ts        ← Mapper DTO externo → DTO interno — agregar cost, org
└── adapter.test.ts   ← Tests unitarios — ampliar
```

### Estructura recomendada final

```
src/modules/suma-impacto/
├── types.ts                ← DTOs Suma + Demoinn (ampliar)
├── schema.ts               ← NUEVO: Zod schema del response de Suma (server-only)
├── env.ts                  ← Env validation (server-only) — corregir
├── client.ts               ← Fetch wrapper (server-only) — corregir P0+P1
├── adapter.ts              ← Mapper — ampliar con cost, organizationName
├── adapter.test.ts         ← Tests adapter — ampliar
├── schema.test.ts          ← NUEVO: Tests del schema Zod
├── env.test.ts             ← NUEVO: Tests de env validation
└── client.test.ts          ← NUEVO: Tests del client (fetch mock)
```

### Invariantes de arquitectura a preservar

1. `env.ts` y `client.ts` deben mantener `import 'server-only'` al inicio.
2. `schema.ts` debe tener `import 'server-only'` — contiene lógica de validación que no necesita el cliente.
3. `types.ts` y `adapter.ts` NO deben tener `server-only` — son código puro reutilizable (el adapter puede usarse en tests de Node sin restricción).
4. Ningún componente client debe importar directamente `client.ts` o `env.ts`.
5. La API key nunca debe aparecer en props, contextos, ni en el bundle del cliente.

---

## 12. Contrato interno Demoinn

### DTO actual: `DemocratizamosExperienceCard`

```ts
type DemocratizamosExperienceCard = {
  id: string;           // id de Suma || reserveUrl como fallback
  title: string;        // name de Suma
  description: string;  // description de Suma, HTML stripped
  imageUrl: string | null; // imageUrl de Suma
  startDate?: string;   // startDate de Suma (ISO string)
  endDate?: string;     // endDate de Suma (ISO string)
  closingDate?: string; // closingDate de Suma (ISO string)
  category?: string;    // types[0] de Suma
  location?: string;    // location || modality || 'Por confirmar'
  href: string;         // publicUrl || reserveUrl de Suma
  ctaHref: string;      // reserveUrl de Suma
};
```

### DTO recomendado ampliado

```ts
type DemocratizamosExperienceCard = {
  // IDENTIDAD
  id: string;                    // id de Suma || reserveUrl
  title: string;                 // name de Suma

  // CONTENIDO
  description: string;           // description, HTML stripped
  imageUrl: string | null;       // imageUrl de Suma

  // FECHAS (ISO strings, sin transformar — el componente formatea)
  startDate?: string;
  endDate?: string;
  closingDate?: string;

  // CLASIFICACIÓN
  category?: string;             // types[0]
  location?: string;             // location física || modality || fallback
  // CONSIDERAR en futura iteración: modality?: string; (separado de location)

  // ORGANIZACIÓN (NUEVO — P2-003)
  organizationName?: string;     // organization de Suma

  // COSTO (NUEVO — P2-002)
  costLabel?: string;            // derivado de cost de Suma: 'Gratuito' | 'Desde $X' | null

  // NAVEGACIÓN
  href: string;                  // publicUrl || reserveUrl
  ctaHref: string;               // reserveUrl (URL de inscripción)
  shortLinkUrl?: string | null;  // shortLinkUrl de Suma
};
```

### Mapa de transformación

| Campo Demoinn | Fuente Suma | Transformación |
|--------------|-------------|----------------|
| `id` | `id` | Direct, fallback a `reserveUrl` |
| `title` | `name` | `.trim()` |
| `description` | `description` | `stripHtmlForCardDescription()` |
| `imageUrl` | `imageUrl` | null si vacío/nulo |
| `startDate` | `startDate` | Pass-through (ISO string) |
| `endDate` | `endDate` | Pass-through (ISO string) |
| `closingDate` | `closingDate` | Pass-through (ISO string) |
| `category` | `types[0]` | String del primer tipo, undefined si vacío |
| `location` | `location \|\| modality` | Fallback a 'Por confirmar' |
| `organizationName` | `organization` | Pass-through, undefined si ausente |
| `costLabel` | `cost` | 'Gratuito' si null/0/'0', 'De pago' si tiene valor, undefined si no hay campo |
| `href` | `publicUrl \|\| reserveUrl` | Fallback chain |
| `ctaHref` | `reserveUrl` | Direct |
| `shortLinkUrl` | `shortLinkUrl` | Pass-through |

### Campos de Suma NO mapeados intencionalmente

| Campo | Razón |
|-------|-------|
| `registrationUrl` | `reserveUrl` cumple la misma función. Incluir si Suma los diferencia. |
| `organizationSlug` | No necesario para las cards actuales. Reservar si se necesita deep link. |
| `types[1..n]` | Solo se usa el primero como categoría. |

---

## 13. Manejo de errores y UX

### Política actual

El client devuelve `{ success: false, total: 0, data: [] }` en cualquier error. La página de programas muestra la sección vacía (texto "no hay proyectos"). No hay error visible para el usuario.

### Política recomendada

| Escenario | Log servidor | UX usuario |
|-----------|-------------|-----------|
| Suma responde 200 con data | — | Cards normales |
| Suma responde 401 | `warn: Suma 401 — check API key` | Sección vacía: "Próximamente nuevas experiencias" |
| Suma responde 404 (org no encontrada) | `warn: Suma 404 — check orgId config` | Sección vacía |
| Suma responde 500 | `warn: Suma 500` | Sección vacía |
| Timeout | `warn: Suma timeout after Xms` | Sección vacía |
| JSON malformado | `error: Suma malformed response` | Sección vacía |
| Schema Zod falla | `error: Suma response invalid schema` | Sección vacía |
| Red no disponible | `warn: Suma network error` | Sección vacía |
| `data` array vacío | — | "No hay experiencias disponibles en este momento" |

**Regla absoluta:** Nunca mostrar stack traces, mensajes de error técnico, ni indicios de la URL/key de Suma al usuario final. El fallback de sección vacía con mensaje amigable es el comportamiento correcto.

### Alertas internas recomendadas

Integrar con el sistema de observabilidad (PostHog, Sentry, o similar) para capturar errores 401/500 repetidos de Suma. Un 401 persistente indica API key expirada o incorrecta.

---

## 14. Caching, performance y disponibilidad

### Estado actual

| Aspecto | Valor actual | Estado |
|---------|-------------|--------|
| Estrategia | ISR (Next.js `next: { revalidate }`) | ✅ Correcto |
| TTL | 1800s (30 minutos) | ✅ Razonable |
| Configurable | No — hardcodeado | ❌ P2-004 |
| Timeout | Ninguno | ❌ P1-001 |
| Retry | Ninguno | ✅ Correcto (no retry agresivo) |
| Fetch por render | No — ISR cachea el resultado | ✅ Correcto |
| Paginación | No — todos los items de la org | Aceptable por ahora |

### Recomendaciones

1. **TTL configurable:** Agregar `SUMA_API_CACHE_TTL_SECONDS` env var (ver P2-004). Default 1800, máximo 3600.
2. **Timeout configurable:** Agregar `SUMA_API_TIMEOUT_MS` env var (ver P1-001, P2-005). Default 8000ms.
3. **Stale-while-revalidate:** Next.js ISR ya implementa SWR nativamente. No se necesita cambio, pero conviene documentar que el TTL define "stale time", no "max age".
4. **Paginación futura:** El endpoint lite ya retorna `total`. Si `total` supera ~20 items, considerar límite de items mostrados en el carrusel. Por ahora no es bloqueante.
5. **No retry:** La ausencia de retry es correcta. Si Suma falla, el ISR mantiene la versión anterior en cache. No se necesita retry agresivo que podría sobrecargar Suma.

---

## 15. Tests necesarios

### Cobertura actual

| Archivo | Tests existentes | Cobertura |
|---------|-----------------|-----------|
| `adapter.ts` | `adapter.test.ts` — 9 casos | ~80% del adapter |
| `client.ts` | Ninguno | 0% |
| `env.ts` | Ninguno | 0% |
| `schema.ts` (a crear) | Ninguno | 0% |
| Integración UI | Ninguno | 0% |

### Plan de tests requerido

#### `env.test.ts`

```
✓ Falta SUMA_IMPACTO_BASE_URL → lanza con mensaje claro
✓ URL inválida (no http/https) → lanza
✓ API key vacía → lanza
✓ API key < 32 chars → lanza (después del fix P1-003)
✓ orgId vacío → lanza
✓ orgId formato inválido → lanza (después del fix P1-004)
✓ Config completa válida → retorna env object
✓ SUMA_IMPACTO_EXPERIENCES_SOURCE ausente → default 'demoinn'
✓ SUMA_API_TIMEOUT_MS ausente → default 8000 (después del fix P2-005)
✓ SUMA_API_TIMEOUT_MS fuera de rango → lanza
✓ SUMA_API_CACHE_TTL_SECONDS ausente → default 1800 (después del fix P2-004)
```

#### `client.test.ts` (con fetch mock)

```
✓ Request incluye header 'x-api-key' con valor correcto
✓ URL del request incluye ?source=demoinn
✓ URL del request NO incluye ?api_key=...
✓ Response 200 válido → retorna datos
✓ Response 401 → FALLBACK
✓ Response 500 → FALLBACK
✓ Network error (fetch lanza) → FALLBACK
✓ JSON malformado → FALLBACK
✓ Timeout (AbortError) → FALLBACK (después del fix P1-001)
✓ Response con success: false → FALLBACK
✓ Response sin data array → FALLBACK
```

#### `schema.test.ts` (cuando se cree schema.ts)

```
✓ Response válido completo pasa el schema
✓ Response con campos opcionales ausentes pasa
✓ Response con success: false falla
✓ Response sin data falla
✓ Response con data no-array falla
✓ Response con total negativo falla
✓ Item con campos extra no rompe (passthrough)
✓ Item sin name pasa (es opcional en el schema)
✓ Item con cost null pasa
✓ Item con imageUrl null pasa
```

#### `adapter.test.ts` (ampliar existente)

```
// Ya existentes (mantener):
✓ mapea name a title
✓ usa reserveUrl como ctaHref
✓ usa publicUrl || reserveUrl como href
✓ limpia HTML de description
✓ filtra items sin name
✓ filtra items sin reserveUrl
✓ maneja imageUrl null o vacío
✓ usa location || modality y fallback
✓ usa id o reserveUrl como id estable

// Nuevos:
✓ <script> en description se elimina
✓ <style> en description se elimina
✓ description con solo HTML → string vacío
✓ cost 'Gratuito' → costLabel correcto (después del fix P2-002)
✓ cost null → costLabel undefined o 'Gratuito'
✓ organization → organizationName (después del fix P2-003)
✓ shortLinkUrl → pass-through
```

#### Tests de integración / UI

```
✓ ProgramasPage renderiza sección vacía cuando getSumaImpactoExperiences() devuelve []
✓ ProgramasPage renderiza cards cuando hay datos válidos
✓ ProgramasProyectosSection no expone API key en el DOM
✓ Estado de loading (si aplica)
✓ Carrusel con 1-3 items no triplica
✓ Carrusel con 4+ items triplica
```

---

## 16. Plan de implementación por fases

> **Regla:** Audit inicial → implementación por problema → audit final por problema → mega audit final.

### Fase 1 — Corrección P0: Header de autenticación (P0-001)

**Objetivo:** Cambiar `api_key` query param a `x-api-key` header.

**Archivos a modificar:**
- `src/modules/suma-impacto/client.ts`

**Pasos:**
1. Eliminar `url.searchParams.set('api_key', experiencesApiKey)`.
2. Conservar `url.searchParams.set('source', source)`.
3. Agregar `'x-api-key': experiencesApiKey` al objeto `headers` del fetch.
4. Escribir `client.test.ts` verificando header correcto y ausencia de api_key en URL.
5. Verificar en dev con logs de red que la key va en header.

**Criterio de cierre:** Tests pasan. Revisión de red confirma key en header.

---

### Fase 2 — Corrección P1: Timeout (P1-001) + env vars timeout/ttl (P2-004, P2-005)

**Objetivo:** Agregar AbortController con timeout configurable.

**Archivos a modificar:**
- `src/modules/suma-impacto/env.ts` (agregar `SUMA_API_TIMEOUT_MS`, `SUMA_API_CACHE_TTL_SECONDS`)
- `src/modules/suma-impacto/client.ts` (AbortController, usar TTL de env)
- `.env.example` (documentar nuevas vars)

**Criterio de cierre:** Tests pasan. Timeout observable en dev simulando respuesta lenta.

---

### Fase 3 — Corrección P1: Validaciones de env (P1-003, P1-004)

**Objetivo:** Reforzar validación de API key (min 32) y orgId (formato).

**Archivos a modificar:**
- `src/modules/suma-impacto/env.ts`

**Pasos:**
1. Cambiar API key a `min(32)`.
2. Agregar regex para orgId.
3. Escribir `env.test.ts`.

**Criterio de cierre:** Tests pasan. Startup falla explícitamente con config incorrecta.

---

### Fase 4 — Corrección P1: Schema Zod del response (P1-002)

**Objetivo:** Crear `schema.ts` con Zod y reemplazar `normalizeBody()` manual.

**Archivos a crear/modificar:**
- `src/modules/suma-impacto/schema.ts` (nuevo)
- `src/modules/suma-impacto/schema.test.ts` (nuevo)
- `src/modules/suma-impacto/client.ts` (usar schema)

**Criterio de cierre:** Tests pasan. Response malformado falla de forma segura.

---

### Fase 5 — Ampliación P2: Campos faltantes (P2-002, P2-003)

**Objetivo:** Agregar `cost`/`costLabel` y `organizationName` al contrato interno.

**Archivos a modificar:**
- `src/modules/suma-impacto/types.ts`
- `src/modules/suma-impacto/adapter.ts`
- `src/modules/suma-impacto/schema.ts`
- `src/modules/suma-impacto/adapter.test.ts`

**Criterio de cierre:** Tests pasan. Cards muestran organización y costo si aplica.

---

### Fase 6 — Docs: Contrato oficial (P2-001)

**Objetivo:** Crear `docs/api/DEMOINN_EXPERIENCES_API.md` con el contrato oficial.

**Archivos a crear:**
- `docs/api/DEMOINN_EXPERIENCES_API.md`

**Criterio de cierre:** Documento existe y refleja el contrato aprobado en Suma.

---

### Fase 7 — Tests completos e integración

**Objetivo:** Alcanzar cobertura completa de client, env, schema, adapter, e integración UI.

**Archivos a crear:**
- `src/modules/suma-impacto/client.test.ts`
- `src/modules/suma-impacto/env.test.ts`
- `src/modules/suma-impacto/schema.test.ts`

**Criterio de cierre:** `npm run test` pasa. Sin tests xfail o skips relacionados con Suma.

---

### Fase 8 — Audit final

**Objetivo:** Revisión completa de la integración cerrada.

**Checklist de cierre:**
- [ ] P0-001 corregido y verificado
- [ ] P1-001 corregido y verificado
- [ ] P1-002 corregido y verificado
- [ ] P1-003 corregido y verificado
- [ ] P1-004 corregido y verificado
- [ ] P2-001 a P2-006 resueltos o documentados como decisión
- [ ] Tests pasan en CI
- [ ] No hay `NEXT_PUBLIC_*` con secretos
- [ ] No hay `api_key` en URLs de red
- [ ] Bundle del cliente no contiene API key

---

## 17. Checklist antes de implementar (estado actual)

- [x] Arquitectura base definida (server-only client, props passing al client)
- [x] Env vars documentadas en `.env.example`
- [x] Integración server-side funcional
- [x] Adapter con tests unitarios básicos
- [x] Error handling: fallback a lista vacía
- [x] ISR caching configurado
- [x] Sin `NEXT_PUBLIC_*` para secrets de Suma
- [ ] **API key enviada en header `x-api-key` (no query param)** — P0-001
- [ ] **Timeout configurado en fetch** — P1-001
- [ ] **Schema Zod del response definido** — P1-002
- [ ] **Validación API key min 32 chars** — P1-003
- [ ] **Validación orgId con formato** — P1-004
- [ ] **Docs del contrato oficial creados** — P2-001
- [ ] **`cost` y `organizationName` en DTO interno** — P2-002, P2-003
- [ ] **TTL configurable via env** — P2-004
- [ ] **Timeout configurable via env** — P2-005
- [ ] Tests de client, env, schema creados — P3-003
- [ ] Tests de integración UI creados — P3-003
- [ ] Sin P0/P1 abiertos antes de cerrar la integración

---

*Generado por audit inicial. No implementar hasta corregir P0 y P1. Próximo paso: Fase 1 — corrección del header de autenticación.*
