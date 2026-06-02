# Demoinn Experiences API Contract

**Versión:** 1.0  
**Fecha:** 2026-06-01  
**Estado:** Aprobado para producción

Este documento describe cómo Demoinn consume el endpoint de experiencias públicas lite de Suma Impacto. Es el contrato local de referencia para desarrolladores que trabajen en este módulo.

---

## Contexto

Demoinn muestra experiencias externas de Suma Impacto en la página `/programas`. Los datos se obtienen server-side mediante ISR (Incremental Static Regeneration) de Next.js. La API key nunca llega al cliente (browser).

Módulo: `src/modules/suma-impacto/`

---

## Endpoint canónico Suma

```
GET /api/experiences/org/{orgId}/lite?source=demoinn
```

---

## Base URL

```
SUMA_IMPACTO_BASE_URL
```

Ejemplo: `https://api.suma-impacto.com`

---

## Autenticación

**Header obligatorio:**

```
x-api-key: <SUMA_IMPACTO_EXPERIENCES_API_KEY>
```

> La API key **nunca** debe enviarse como query param (`?api_key=...`).  
> La API key **nunca** debe aparecer en variables `NEXT_PUBLIC_*`.  
> La API key **nunca** debe llegar al bundle del cliente.

---

## Variables de entorno Demoinn

| Variable | Requerida | Default | Validación | Descripción |
|----------|-----------|---------|------------|-------------|
| `SUMA_IMPACTO_BASE_URL` | Sí | — | URL http(s) válida | Base URL de la API de Suma |
| `SUMA_IMPACTO_EXPERIENCES_API_KEY` | Sí | — | min 32 chars, no placeholder | API key de autenticación |
| `SUMA_IMPACTO_DEMOINN_ORG_ID` | Sí | — | 24-char hex (MongoDB ObjectId) | ID de la org de Demoinn en Suma |
| `SUMA_IMPACTO_EXPERIENCES_SOURCE` | No | `demoinn` | string no vacío | Valor del query param `source` |
| `SUMA_IMPACTO_API_TIMEOUT_MS` | No | `8000` | entero, 1000–30000 | Timeout del fetch en ms |
| `SUMA_IMPACTO_API_CACHE_TTL_SECONDS` | No | `1800` | entero, 60–3600 | TTL del cache ISR en segundos |

Validación centralizada en: `src/modules/suma-impacto/env.ts`

Placeholders que fallan la validación al startup (si se dejan sin cambiar):
- `SUMA_IMPACTO_EXPERIENCES_API_KEY=replace-with-secure-32-plus-char-key`
- `SUMA_IMPACTO_DEMOINN_ORG_ID=replace-with-24-char-mongo-object-id`

---

## Request construido por Demoinn

```
GET {SUMA_IMPACTO_BASE_URL}/api/experiences/org/{SUMA_IMPACTO_DEMOINN_ORG_ID}/lite?source=demoinn

Headers:
  Accept: application/json
  x-api-key: <secret — solo server-side>
```

Ejemplo real (con valores de ejemplo):
```
GET https://api.suma-impacto.com/api/experiences/org/507f1f77bcf86cd799439011/lite?source=demoinn
```

---

## Response esperado de Suma

```json
{
  "success": true,
  "total": 1,
  "data": [
    {
      "id": "64a1b2c3d4e5f6789012abcd",
      "name": "Taller de Inclusión Digital",
      "types": ["Taller", "Presencial"],
      "description": "<p>Aprende competencias digitales...</p>",
      "startDate": "2026-08-01T10:00:00.000Z",
      "endDate": "2026-08-01T18:00:00.000Z",
      "closingDate": "2026-07-28T23:59:59.000Z",
      "organization": "Democratizamos",
      "organizationSlug": "democratizamos",
      "location": "CDMX",
      "modality": "Presencial",
      "imageUrl": "https://res.cloudinary.com/suma/image/upload/v1/taller.jpg",
      "registrationUrl": "https://suma.example/register/taller",
      "reserveUrl": "https://suma.example/o/experiences?e=taller-digital",
      "publicUrl": "https://suma.example/public/taller-digital",
      "shortLinkUrl": "https://s.suma.example/td",
      "cost": "FREE"
    }
  ]
}
```

### Valores posibles de `cost`

| Valor | Significado |
|-------|-------------|
| `"FREE"` | Gratuito |
| `"PAID"` | De pago |
| `"SUBSIDY"` | Subsidiado |
| `null` | Sin información |

### Campos que pueden ser `null`

`closingDate`, `imageUrl`, `location`, `modality`, `shortLinkUrl`, `cost`, `startDate`, `endDate`

---

## Validación runtime en Demoinn

El response de Suma es validado con Zod **antes** de pasar al adapter.

Schema: `src/modules/suma-impacto/schema.ts`

**Política A (Strict):** si el response no cumple el schema, se devuelve fallback vacío.
La sección de experiencias muestra el estado vacío en lugar de datos potencialmente corruptos.

```ts
const validated = sumaImpactoLiteResponseSchema.safeParse(parsed);
if (!validated.success) return FALLBACK;
```

**Campos extra de Suma:** el item schema usa `.passthrough()`. Campos que Suma agregue en el
futuro son ignorados por TypeScript pero pasan por el sistema sin romper nada.

---

## DTO interno Demoinn — `DemocratizamosExperienceCard`

Los componentes de Demoinn **solo consumen este DTO**. Nunca acceden directamente a los tipos
de Suma.

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `id` | `string` | ID de Suma, o `reserveUrl` como fallback |
| `title` | `string` | Nombre de la experiencia |
| `description` | `string` | Descripción con HTML strips |
| `imageUrl` | `string \| null` | URL de imagen, null si ausente |
| `startDate` | `string \| null \| undefined` | Fecha inicio (ISO string) |
| `endDate` | `string \| null \| undefined` | Fecha fin (ISO string) |
| `closingDate` | `string \| null \| undefined` | Fecha cierre inscripciones (ISO string) |
| `category` | `string \| undefined` | Primer tipo de la experiencia |
| `location` | `string \| undefined` | Ubicación física o modalidad |
| `organizationName` | `string \| undefined` | Nombre de la org que oferta |
| `costLabel` | `string \| undefined` | Label humano del costo |
| `href` | `string` | URL de detalle público |
| `ctaHref` | `string` | URL de inscripción (CTA) |

Nota: `shortLinkUrl` está disponible en `SumaImpactoLiteExperience` pero no está expuesto en
`DemocratizamosExperienceCard` actualmente. Puede agregarse en una iteración futura si se
necesita en componentes.

---

## Mapping: Suma → DemocratizamosExperienceCard

Implementado en: `src/modules/suma-impacto/adapter.ts`

| Campo Demoinn | Campo Suma | Transformación |
|--------------|------------|----------------|
| `id` | `id` | `.trim()`, fallback a `reserveUrl` si vacío |
| `title` | `name` | `.trim()` |
| `description` | `description` | `stripHtmlForCardDescription()` — quita HTML, colapsa espacios |
| `imageUrl` | `imageUrl` | `null` si vacío o nulo |
| `startDate` | `startDate` | Pass-through |
| `endDate` | `endDate` | Pass-through |
| `closingDate` | `closingDate` | Pass-through |
| `category` | `types[0]` | Primer elemento del array, `undefined` si vacío |
| `location` | `location \|\| modality` | Fallback chain: location → modality → `'Por confirmar'` |
| `organizationName` | `organization` | `.trim()`, `undefined` si vacío |
| `costLabel` | `cost` | `mapSumaCostToLabel()`: FREE→Gratuito, PAID→De pago, SUBSIDY→Subsidio, otros→`undefined` |
| `href` | `publicUrl \|\| reserveUrl` | Fallback chain |
| `ctaHref` | `reserveUrl` | Direct |

### Filtro de items

El adapter descarta items que no tengan `name` (no vacío) y `reserveUrl`. Sin estos dos campos,
no se puede construir una card útil.

---

## Errores y fallback

Demoinn nunca lanza al usuario final cuando Suma falla. Todos los errores producen fallback
vacío (`{ success: false, total: 0, data: [] }`).

| Escenario | Comportamiento Demoinn | Log en dev |
|-----------|----------------------|------------|
| HTTP 401 Unauthorized | Fallback vacío | `warn` |
| HTTP 403 Forbidden | Fallback vacío | `warn` |
| HTTP 404 Not Found | Fallback vacío | `warn` |
| HTTP 500 Server Error | Fallback vacío | `warn` |
| Timeout (`>SUMA_IMPACTO_API_TIMEOUT_MS`) | Fallback vacío | `warn` |
| Network error | Fallback vacío | `warn` |
| JSON malformado | Fallback vacío | `error` |
| Response no cumple schema Zod | Fallback vacío | `error` |
| URL inválida (config bug) | Fallback vacío | `error` |

**La sección de experiencias en `/programas` muestra texto vacío.** No se exponen errores
técnicos al usuario final.

---

## Caching

Demoinn usa ISR de Next.js para cachear el response de Suma:

```ts
fetch(url, { next: { revalidate: cacheTtlSeconds } })
```

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| Estrategia | ISR Next.js | El primer request tras expirar el TTL regenera el cache |
| TTL default | 1800s (30 min) | Configurable con `SUMA_IMPACTO_API_CACHE_TTL_SECONDS` |
| TTL mínimo | 60s | Evita martillar a Suma en cada render |
| TTL máximo | 3600s (1 hora) | Límite razonable para content fresco |
| Stale-while-revalidate | Sí (ISR) | El usuario ve el contenido anterior mientras se regenera |
| Retry en fallo | No | Si Suma falla en revalidación, ISR mantiene la versión anterior |

---

## Timeout

```ts
const controller = new AbortController();
const timer = setTimeout(() => controller.abort(), timeoutMs);
// ...
response = await fetch(url, { signal: controller.signal, ... });
// ...
finally { clearTimeout(timer); }
```

| Parámetro | Valor | Descripción |
|-----------|-------|-------------|
| Mecanismo | AbortController + setTimeout | Aborta el fetch si Suma no responde |
| Default | 8000ms (8s) | Configurable con `SUMA_IMPACTO_API_TIMEOUT_MS` |
| Mínimo | 1000ms | Evita timeouts accidentales en latencia normal |
| Máximo | 30000ms | Límite del runtime de Vercel |
| Timer cleanup | `finally` block | El timer siempre se limpia, en éxito y en error |

---

## Seguridad

- La API key viaja **únicamente** en el header `x-api-key`. Nunca como query param.
- `env.ts` importa `server-only` — TypeScript impide importar desde componentes client.
- `client.ts` importa `server-only` — mismo mecanismo.
- La API key no aparece en logs (`logDev` no loguea valores de secretos).
- El orgId viene de una variable de entorno validada — no de input de usuario.
- El parámetro `source` tiene default `'demoinn'` — no configurable por el usuario final.
- Los IDs de experiencias en el DTO son opacos (vienen de Suma tal como son).
- El response de Suma es validado por Zod antes de llegar al componente (Política A).

**Variables que NUNCA deben ser `NEXT_PUBLIC_*`:**
- `SUMA_IMPACTO_EXPERIENCES_API_KEY`
- `SUMA_IMPACTO_DEMOINN_ORG_ID`
- `SUMA_IMPACTO_BASE_URL`

---

## Archivos del módulo

```
src/modules/suma-impacto/
├── env.ts              Validación de env vars (server-only)
├── schema.ts           Zod schemas del response de Suma (server-only)
├── client.ts           Fetch wrapper con ISR + timeout (server-only)
├── adapter.ts          Mapper DTO Suma → DTO Demoinn (pure function)
├── types.ts            Definiciones de tipos TypeScript
├── adapter.test.ts     Tests unitarios del adapter
├── client.test.ts      Tests del client (fetch mock)
├── env.test.ts         Tests de validación de env
└── schema.test.ts      Tests del Zod schema
```

---

## Endpoint legacy — NO usar

```
GET /api/experiences/org/{orgId}   ← NO
```

Demoinn solo debe consumir el endpoint `/lite`. El endpoint sin `/lite` no está aprobado
para este caso de uso.

---

## Checklist de integración

Antes de desplegar cualquier cambio en este módulo:

- [ ] `SUMA_IMPACTO_BASE_URL` configurada como URL http(s)
- [ ] `SUMA_IMPACTO_EXPERIENCES_API_KEY` con 32+ chars, no placeholder
- [ ] `SUMA_IMPACTO_DEMOINN_ORG_ID` con 24-char hex ObjectId
- [ ] API key en header `x-api-key`, no en query param
- [ ] `npm run type-check` pasa
- [ ] `npm run test` pasa
- [ ] No hay variables `NEXT_PUBLIC_SUMA_*` en el proyecto
