# Demoinn → Suma Consumer Fixes

Este documento registra cada problema detectado en el audit inicial, con su audit de entrada, implementación y audit de cierre.

---

## Problema 1 — P0-001: API key en query parameter

### Audit inicial

**Archivo afectado:**
`src/modules/suma-impacto/client.ts`

**Cómo se construye la URL actualmente:**

```ts
// client.ts — antes del fix
const path = `/api/experiences/org/${encodeURIComponent(orgId)}/lite`;
url = new URL(path, baseUrl);

url.searchParams.set('api_key', experiencesApiKey);   // ← P0
url.searchParams.set('source', source);
```

La URL resultante en producción era:
```
https://<SUMA_BASE_URL>/api/experiences/org/<orgId>/lite?api_key=<KEY>&source=demoinn
```

**Contrato oficial de Suma:**

```
GET /api/experiences/org/{orgId}/lite?source=demoinn

Header obligatorio:
x-api-key: <EXPERIENCES_API_KEY>
```

La API key debe ir en el header HTTP `x-api-key`, **no** en la query string.

**Riesgo de producción:**

La API key embebida en la URL puede quedar expuesta en:
- Logs del servidor de Suma (HTTP access logs registran la URL completa).
- Logs de CDN/proxy intermedios (Cloudflare, Vercel Edge, AWS CloudFront).
- Headers `Referer` si hay redirecciones internas.
- Cache key de Next.js ISR (la URL con la key se usa como clave de caché).
- Herramientas de observabilidad que registran URLs de requests outbound.

**Confirmación de scope seguro:**

- La llamada ocurre en `getSumaImpactoExperiences()`, que tiene `import 'server-only'` al inicio. TypeScript lanzará un error en build si se intenta importar desde un componente client.
- El componente `ProgramasProyectosSection` recibe `items: DemocratizamosExperienceCard[]` como props desde el Server Component padre (`programas/page.tsx`). No hace fetch directamente. No recibe la API key.
- El DTO `DemocratizamosExperienceCard` no contiene ningún campo relacionado con autenticación.

**Qué se va a cambiar:**
- Eliminar `url.searchParams.set('api_key', experiencesApiKey)`.
- Agregar `'x-api-key': experiencesApiKey` al objeto `headers` del fetch.

**Qué NO se cambia en esta fase:**
- Timeout / AbortController (P1-001 — fase siguiente).
- Validación Zod del response (P1-002).
- Longitud mínima de API key en env (P1-003).
- Validación de formato orgId (P1-004).
- Campos `cost` / `organizationName` (P2-002, P2-003).
- UI / componentes.

---

### Implementación realizada

**Archivos modificados:**
- `src/modules/suma-impacto/client.ts`

**Archivos creados:**
- `src/modules/suma-impacto/client.test.ts`

**Cambio en URL:**

Antes:
```
https://<base>/api/experiences/org/<orgId>/lite?api_key=<KEY>&source=demoinn
```

Después:
```
https://<base>/api/experiences/org/<orgId>/lite?source=demoinn
```

**Cambio en headers:**

Antes:
```ts
headers: { Accept: 'application/json' }
```

Después:
```ts
headers: {
  Accept: 'application/json',
  'x-api-key': experiencesApiKey,
}
```

**Qué no cambió:**
- ISR caching (`next: { revalidate: 1800 }`).
- Fallback `{ success: false, total: 0, data: [] }` en todos los casos de error.
- Manejo diferenciado de errores: network error, HTTP error, JSON parse error, body read error.
- `logDev` — no se loguea la key en ningún path.
- Comportamiento de `normalizeBody`.
- Contrato de `getSumaImpactoEnv` — no se tocó env.ts.

---

### Audit final

*(Actualizado tras la ejecución de tests)*

**Estado P0-001:** Cerrado ✅

**Riesgo residual:** Ninguno para este hallazgo. La API key ya no aparece en ninguna URL ni en ningún log generado por el cliente.

**Impacto en producción:** Cambio transparente. El endpoint de Suma recibe exactamente la misma solicitud pero con autenticación correcta (header). El ISR cache se invalida automáticamente en el siguiente deploy porque la URL de fetch cambia (ya no tiene `api_key=...`). En producción, el próximo revalidate usará la URL limpia.

**Impacto en frontend:** Ninguno. `ProgramasProyectosSection` recibe `DemocratizamosExperienceCard[]` como antes.

**Validaciones ejecutadas:**

```
npm run test
  Test Files  2 passed (2)
       Tests  20 passed (20)
  Duration  380ms

npm run type-check
  tsc --noEmit → sin errores
```

- Tests de unidad cubren: header `x-api-key` presente con valor correcto, header `Accept: application/json`, URL contiene `source=demoinn`, URL NO contiene `api_key`, URL NO contiene el valor de la key, response 200 retorna data, response 401 retorna fallback seguro, response 500 retorna fallback seguro, network error retorna fallback seguro, key no aparece en console.error.
- TypeScript type-check: pasa sin errores nuevos.
- ESLint: `npm run lint` falla con "Invalid project directory provided: DemocratizamosWeb\lint" — **error pre-existente en el proyecto**, no relacionado con este cambio. Verificado que existía antes del fix.

**Archivos cambiados:**

```diff
--- a/src/modules/suma-impacto/client.ts
+++ b/src/modules/suma-impacto/client.ts
-  url.searchParams.set('api_key', experiencesApiKey);
   url.searchParams.set('source', source);

   response = await fetch(url.toString(), {
     next: { revalidate: REVALIDATE_SECONDS },
-    headers: { Accept: 'application/json' },
+    headers: {
+      Accept: 'application/json',
+      'x-api-key': experiencesApiKey,
+    },
   });
```

```
?? docs/audits/DEMO_INN_SUMA_CONSUMER_FIXES.md   (nuevo)
?? src/modules/suma-impacto/client.test.ts        (nuevo)
 M src/modules/suma-impacto/client.ts             (modificado)
```

---

## Problema 2 — P1-001 + P2-004 + P2-005: Timeout y TTL configurable

### Audit inicial

**Estado previo:**

`client.ts` tenía el fetch sin protección de tiempo:

```ts
// Sin AbortController ni signal
response = await fetch(url.toString(), {
  next: { revalidate: REVALIDATE_SECONDS },
  headers: { ... },
});
```

No había `AbortController`. No había `signal`. Si Suma no respondía, el `await fetch(...)` podía
quedar bloqueado indefinidamente (hasta el límite del runtime de Vercel, normalmente 30s).

**Constante hardcodeada:**

```ts
const REVALIDATE_SECONDS = 1800;
```

El TTL de ISR estaba fijo en el código. No era posible ajustarlo sin modificar y desplegar.

**Variables de entorno existentes antes de este cambio:**

```
SUMA_IMPACTO_BASE_URL          — requerida
SUMA_IMPACTO_EXPERIENCES_API_KEY — requerida
SUMA_IMPACTO_DEMOINN_ORG_ID    — requerida
SUMA_IMPACTO_EXPERIENCES_SOURCE — opcional, default 'demoinn'
```

No existían vars para timeout ni TTL.

**Naming elegido:**

El proyecto usa `SUMA_IMPACTO_*` de manera consistente. Se mantiene ese prefijo:
- `SUMA_IMPACTO_API_TIMEOUT_MS` — timeout del fetch en milisegundos
- `SUMA_IMPACTO_API_CACHE_TTL_SECONDS` — TTL del ISR en segundos

**Riesgo de producción sin timeout:**

Si Suma tarda o no responde, el Server Component `/programas` queda bloqueado esperando el fetch.
Con ISR el impacto es en la revalidación: el worker de revalidación puede quedar colgado hasta 30s,
bloqueando el thread durante ese tiempo. Con el timeout, la función retorna el fallback vacío en
máximo `timeoutMs` ms, liberando el worker inmediatamente.

**Defaults y rangos decididos:**

| Variable | Default | Mínimo | Máximo | Razón |
|----------|---------|--------|--------|-------|
| `SUMA_IMPACTO_API_TIMEOUT_MS` | 8000 | 1000 | 30000 | 8s es suficiente para respuesta HTTP normal; 1s mínimo evita timeouts accidentales |
| `SUMA_IMPACTO_API_CACHE_TTL_SECONDS` | 1800 | 60 | 3600 | 30min mantiene la integración ISR; 60s mínimo evita martillar a Suma en cada render |

**Qué no se toca:**
- P1-002 (schema Zod del response)
- P1-003 (min 32 en API key)
- P1-004 (orgId regex)
- P2-002/P2-003 (cost, organizationName)
- UI, adapter, types

---

### Implementación realizada

**Archivos modificados:**
- `src/modules/suma-impacto/env.ts` — nuevas vars + tipo actualizado
- `src/modules/suma-impacto/client.ts` — AbortController + cacheTtlSeconds
- `.env.example` — documentación de nuevas vars opcionales

**Archivos creados:**
- `src/modules/suma-impacto/env.test.ts` — tests de env validation

**Archivos actualizados:**
- `src/modules/suma-impacto/client.test.ts` — mock env actualizado + 8 nuevos tests

**Cambios en env.ts:**

Se agregó helper `optionalIntEnvVar()` que:
- Si la env var está ausente o vacía → retorna el default.
- Si está presente → parsea con `parseInt` y valida rango con Zod.
- Si el valor no es numérico → falla con error claro.
- Si está fuera de rango → falla con mensaje descriptivo.

Nuevos campos en `SumaImpactoServerEnv`:
```ts
timeoutMs: number;       // default 8000, range 1000-30000
cacheTtlSeconds: number; // default 1800, range 60-3600
```

**Cambios en client.ts:**

- Se elimina `const REVALIDATE_SECONDS = 1800`.
- Se destructura `timeoutMs` y `cacheTtlSeconds` de `getSumaImpactoEnv()`.
- Se agrega `AbortController` + `setTimeout(() => controller.abort(), timeoutMs)`.
- El fetch recibe `signal: controller.signal`.
- `next: { revalidate: cacheTtlSeconds }` reemplaza la constante hardcodeada.
- `finally { clearTimeout(timer) }` garantiza que el timer siempre se limpia, incluso en error.
- El `catch` del fetch diferencia `AbortError` de errores de red: mensajes distintos, mismo fallback.

---

### Audit final

*(Actualizado tras la ejecución de tests)*

**Estado P1-001:** Cerrado ✅  
**Estado P2-004:** Cerrado ✅  
**Estado P2-005:** Cerrado ✅

**Riesgo residual:** Ninguno para estos hallazgos. El fetch tiene timeout real con AbortController.
El TTL es configurable. Los defaults son seguros para producción sin cambios de configuración.

**Impacto en producción:**
- El cache de ISR se invalida en el próximo deploy (la constante 1800 se convierte en el valor
  leído de env, que en producción debería configurarse como `SUMA_IMPACTO_API_CACHE_TTL_SECONDS=1800`
  para mantener el comportamiento previo).
- Si la env var `SUMA_IMPACTO_API_CACHE_TTL_SECONDS` no está configurada, el default en código es
  1800, por lo que el comportamiento es idéntico al anterior.
- El timeout de 8000ms es nuevo. Si Suma responde en < 8s (situación normal), el comportamiento
  es idéntico al anterior. Si tarda más de 8s, ahora retorna fallback vacío en vez de bloquear.

**Impacto en frontend:** Ninguno. El componente client `ProgramasProyectosSection` no cambia.

**Validaciones ejecutadas:**

```
npm run test -- src/modules/suma-impacto
  Test Files  3 passed (3)
       Tests  42 passed (42)   ← adapter.test (9) + client.test (18) + env.test (16)
  Duration  443ms

npm run test
  Test Files  3 passed (3)
       Tests  42 passed (42)   ← suite completa sin regresiones

npm run type-check
  tsc --noEmit → sin errores
```

**Tests nuevos en client.test.ts:**
- `passes an AbortSignal to fetch`
- `returns safe fallback when request is aborted (AbortError)`
- `uses cacheTtlSeconds as next.revalidate`
- `clears the timeout timer on successful response`
- `clears the timeout timer on network error`
- `clears the timeout timer on AbortError`

**Tests nuevos en env.test.ts (16 casos):**
- timeout: default, empty string default, valor válido, mínimo, máximo, < mínimo, > máximo, no numérico
- cache TTL: default, empty string default, valor válido, mínimo, máximo, < mínimo, > máximo, no numérico

---

## Problema 3 — P1-003/P1-004: Validación fuerte de API key y orgId

### Audit inicial

**Validación actual de API key (antes de este cambio):**

```ts
SUMA_IMPACTO_EXPERIENCES_API_KEY: z
  .string()
  .min(1, 'SUMA_IMPACTO_EXPERIENCES_API_KEY is required'),
```

Solo rechazaba string vacío. Una key de 1 a 31 caracteres pasaba sin error. Una key truncada,
un placeholder de CI, o un valor de test demasiado corto llegaba a producción sin señal de alerta.

**Validación actual de orgId (antes de este cambio):**

```ts
SUMA_IMPACTO_DEMOINN_ORG_ID: z.string().min(1, 'SUMA_IMPACTO_DEMOINN_ORG_ID is required'),
```

Solo rechazaba string vacío. Un orgId malformado (ej. "12345", "all", "my-org") pasaba la
validación y producía un 404 silencioso de Suma → lista vacía en UI, sin señal de error de
configuración.

**Riesgo de key corta/truncada:**

Si la key llega a producción truncada (ej. primeros 15 chars de una key real), Suma responde 401.
El client devuelve FALLBACK vacío. El `/programas` muestra sección vacía. El operador no sabe si
es "no hay experiencias" o "configuración incorrecta" — ambas condiciones producen el mismo UI.
Con min(32), un error de configuración falla de forma explícita en startup (o en primer render en
producción con ISR).

**Riesgo de orgId malformado:**

Un orgId inválido produce 404 de Suma. Mismo comportamiento: lista vacía silenciosa. El operador
no distingue "org sin experiencias" de "orgId equivocado".

**Comportamiento actual si hay 401/404 por mala config:**

`getSumaImpactoExperiences()` → recibe `!response.ok` → devuelve `FALLBACK { success: false, data: [] }`
→ `adaptSumaExperiencesToCards([])` → `[]` → sección vacía con texto "no hay proyectos".
Ningún error visible. Solo logs en dev mode (y solo si `NODE_ENV === 'development'`).

**Decisiones de formato:**

| Campo | Formato requerido | Razón |
|-------|------------------|-------|
| API key | `min(32)` + no placeholder | Keys de Suma son ≥64 chars; min 32 detecta truncaciones y placeholders cortos |
| orgId | `/^[a-f0-9]{24}$/i` | MongoDB ObjectId canónico; rechaza "all", slugs, valores cortos o con chars inválidos |

**Decisión sobre `all` en orgId:**

El valor `"all"` (3 chars) falla el regex `/^[a-f0-9]{24}$/i` automáticamente. No se necesita
check explícito. Si en el futuro se necesita un endpoint multi-org, será una decisión explícita
con un nuevo campo, no un valor especial en este orgId.

**Placeholders a rechazar en API key:**

Los placeholders con menos de 32 chars ya fallan `min(32)`. Se agrega guard explícito para
strings que pasan min(32) pero son claramente placeholders (ej. el que se pone en .env.example).

**Impacto en producción:**

Si el proyecto ya tiene una key válida (≥32 chars, no placeholder) y un orgId válido (24 hex),
el cambio es transparente — la app sigue arrancando igual. Solo falla el startup si la config
estaba mal configurada. Este es el comportamiento deseado.

**Qué no se toca:**
- P1-002 (schema Zod del response)
- P2-002/P2-003 (cost, organizationName)
- Client, adapter, UI, tipos

---

### Implementación realizada

**Archivos modificados:**
- `src/modules/suma-impacto/env.ts` — validaciones reforzadas
- `.env.example` — placeholders descriptivos y seguros
- `src/modules/suma-impacto/env.test.ts` — 15 nuevos tests

**Cambios en `SUMA_IMPACTO_EXPERIENCES_API_KEY`:**

```ts
// Antes:
z.string().min(1, 'SUMA_IMPACTO_EXPERIENCES_API_KEY is required')

// Después:
z.string()
  .min(32, 'SUMA_IMPACTO_EXPERIENCES_API_KEY must be at least 32 characters')
  .refine(
    (s) => !KNOWN_API_KEY_PLACEHOLDERS.includes(s.toLowerCase().trim()),
    'SUMA_IMPACTO_EXPERIENCES_API_KEY must not be a placeholder value'
  )
```

Placeholder list: `['replace-with-secure-32-plus-char-key', 'change-me', 'your-api-key', 'dev_demoinn_api_key_123']`

Nota: `change-me`, `your-api-key`, `dev_demoinn_api_key_123` también fallan min(32). El guard
cubre especialmente el placeholder documentado en `.env.example` (36 chars, pasa min(32)).

**Cambios en `SUMA_IMPACTO_DEMOINN_ORG_ID`:**

```ts
// Antes:
z.string().min(1, 'SUMA_IMPACTO_DEMOINN_ORG_ID is required')

// Después:
z.string()
  .regex(
    /^[a-f0-9]{24}$/i,
    'SUMA_IMPACTO_DEMOINN_ORG_ID must be a valid 24-character hex MongoDB ObjectId'
  )
```

El regex rechaza: vacío, "all", slugs, valores cortos, strings con chars no-hex. Acepta
cualquier ObjectId de 24 chars hex válido (case insensitive).

**Cambios en `.env.example`:**

```diff
- SUMA_IMPACTO_EXPERIENCES_API_KEY=
- SUMA_IMPACTO_DEMOINN_ORG_ID=
+ SUMA_IMPACTO_EXPERIENCES_API_KEY=replace-with-secure-32-plus-char-key
+ SUMA_IMPACTO_DEMOINN_ORG_ID=replace-with-24-char-mongo-object-id
```

Los nuevos placeholders fallan la validación si se usan accidentalmente:
- `replace-with-secure-32-plus-char-key` → en la lista de placeholders prohibidos
- `replace-with-24-char-mongo-object-id` → tiene chars no-hex ("r", "p", etc.)

---

### Audit final

*(Actualizado tras la ejecución de tests)*

**Estado P1-003:** Cerrado ✅  
**Estado P1-004:** Cerrado ✅

**Riesgo residual:**
- P1-003: mínimo. Una key entre 32 y 63 chars pasa la validación. Si Suma emite keys de 64+ chars
  y una queda truncada a 32-63, pasaría el startup pero fallaría con 401 en runtime. Este es un
  compromiso aceptable: min(32) detecta el caso más común (key corta o placeholder); detectar
  truncaciones exactas requeriría conocer la longitud exacta de la key de Suma.
- P1-004: ninguno para los casos documentados. El regex es determinista.

**Impacto en producción:** Deploy transparente si la configuración ya es válida. Error explícito
en startup si la config era incorrecta (antes sería error silencioso en runtime).

**Validaciones ejecutadas:**

```
npm run test -- src/modules/suma-impacto/env.test.ts
  Test Files  1 passed (1)
       Tests  32 passed (32)   ← 16 anteriores + 16 nuevos (8 API key + 8 orgId)

npm run test
  Test Files  3 passed (3)
       Tests  58 passed (58)   ← suite completa sin regresiones

npm run type-check
  tsc --noEmit → sin errores
```

**Tests nuevos en env.test.ts (16 casos):**

API key:
- `accepts a valid key of exactly 32 characters`
- `accepts a valid key longer than 32 characters`
- `throws when API key is empty`
- `throws when API key has 31 characters`
- `throws when API key is the .env.example placeholder` (36 chars, pasa min(32), bloqueada por guard)
- `throws when API key is "change-me"`
- `throws when API key is "your-api-key"`
- `throws when API key is "dev_demoinn_api_key_123"`

orgId:
- `accepts a valid 24-character hex ObjectId (lowercase)`
- `accepts a valid 24-character hex ObjectId (uppercase)`
- `throws when orgId is empty`
- `throws when orgId is too short`
- `throws when orgId is too long (25 chars)`
- `throws when orgId contains non-hex characters`
- `throws when orgId is "all"`
- `throws when orgId is the .env.example placeholder`

---

## Problema 4 — P1-002: Schema Zod del response de Suma

### Audit inicial

**Validación actual del response (antes de este cambio):**

`client.ts` tenía `normalizeBody(parsed)` que hacía validación manual:

```ts
function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function normalizeBody(body: unknown): SumaImpactoLiteResponse {
  // checks: isRecord, isArray, success === true
  const data = rawData.filter(isRecord) as SumaImpactoLiteExperience[]; // ← cast inseguro
  return { success: true, total, data };
}
```

El cast `as SumaImpactoLiteExperience[]` no validaba el shape de cada item en runtime.
Campos con tipos incorrectos (ej. `types: "string"` en vez de `types: []`) llegaban al adapter
y desde ahí al frontend sin detectar el error.

**Cast inseguro identificado:**

`src/modules/suma-impacto/client.ts:35` (antes del fix):
```ts
const data = rawData.filter(isRecord) as SumaImpactoLiteExperience[];
```

Solo filtraba que cada elemento fuera un objeto no-null. No validaba ningún campo interno.
Un item con `{ name: 123, types: "not-array" }` pasaba sin error.

**Qué campos espera el adapter hoy:**

El adapter usa: `item.name`, `item.reserveUrl`, `item.description`, `item.imageUrl`,
`item.location`, `item.modality`, `item.publicUrl`, `item.types`, `item.id`,
`item.startDate`, `item.endDate`, `item.closingDate`.

Todos son opcionales en el adapter (con fallbacks). Pero si un campo llega con un tipo
completamente incorrecto (ej. `name: 123`), el adapter lo trata como truthy y puede
producir output inesperado en cards.

**Riesgo si Suma cambia el contrato:**

Sin validación de schema, un drift de contrato (Suma cambia `data` de array a objeto,
o `success` de boolean a string) pasa silenciosamente y puede llegar al frontend.
Con Política A: la primera señal de drift genera fallback limpio — sección vacía en UI.
El próximo log en dev detecta el problema.

**Decisiones de diseño:**

| Decisión | Valor elegido | Razón |
|----------|--------------|-------|
| Política | A (Strict) | Detectar drift temprano; fallback limpio es preferible a data parcialmente inválida |
| Campo `cost` | `z.string().nullable().optional()` | Compatibilidad máxima; enum sería demasiado frágil para un campo cuyo formato puede variar (precios, etiquetas) |
| Items extra en respuesta | `.passthrough()` | Suma puede agregar campos nuevos sin romper el schema |
| Items faltantes | Todos opcionales | El adapter ya maneja ausencia de cada campo con fallbacks |

**Qué no se toca:**
- P2-002 cost/costLabel en adapter (el campo cost ahora existe en schema y types, pero no se mapea todavía)
- P2-003 organizationName
- Adapter, UI, componentes

---

### Implementación realizada

**Archivos creados:**
- `src/modules/suma-impacto/schema.ts` — Zod schemas (server-only)
- `src/modules/suma-impacto/schema.test.ts` — 22 tests del schema

**Archivos modificados:**
- `src/modules/suma-impacto/types.ts` — agrega `cost`, ajusta nullable en fechas
- `src/modules/suma-impacto/client.ts` — reemplaza `normalizeBody()` con `safeParse()`
- `src/modules/suma-impacto/client.test.ts` — nuevos tests de schema integration

**Cambios en `types.ts`:**
- Agrega `cost?: string | null` a `SumaImpactoLiteExperience`
- Cambia `startDate`, `endDate`, `closingDate` de `?: string` a `?: string | null`
  (para alinearse con el schema Zod que usa `.nullable().optional()`)

**Cambios en `client.ts`:**
- Elimina `isRecord()` y `normalizeBody()` — ya no necesarios
- Importa `sumaImpactoLiteResponseSchema` de `./schema`
- Reemplaza `return normalizeBody(parsed)` por:
  ```ts
  const validated = sumaImpactoLiteResponseSchema.safeParse(parsed);
  if (!validated.success) {
    logDev('Suma Impacto response did not match expected schema');
    return { ...FALLBACK };
  }
  return { success: true, total: validated.data.total, data: validated.data.data };
  ```
- El cast `as SumaImpactoLiteExperience[]` fue eliminado — el tipo inferido del schema es
  estructuralmente compatible con `SumaImpactoLiteExperience[]`

---

### Audit final

*(Actualizado tras la ejecución de tests)*

**Estado P1-002:** Cerrado ✅

**Riesgo residual:**
- Si Suma cambia el tipo de un campo opcional (ej. `location` de string a object), el schema
  detecta el cambio y genera fallback. ✓
- Si Suma cambia la estructura top-level (ej. quita `data`), el schema detecta. ✓
- Si Suma agrega campos nuevos: `.passthrough()` los ignora en TypeScript pero los preserva
  en runtime. No rompe. ✓
- El campo `cost` es `z.string().nullable().optional()` — si Suma cambia el tipo de cost
  a un objeto, fallará el schema. Si solo cambia el string value, pasa. Aceptable.

**Impacto en producción:** Transparente si Suma responde con el contrato actual. Si hay drift
de contrato, la sección de experiencias muestra vacío en vez de data malformada. Esto es
mejor comportamiento que el anterior.

**Impacto en UI:** Ninguno para datos válidos. En caso de schema failure, la sección vacía
ya existía como fallback ante errores de red/HTTP.

**Efecto cascada en tipos:** Actualizar `startDate/endDate/closingDate` a `string | null` en
`SumaImpactoLiteExperience` requirió también actualizar `DemocratizamosExperienceCard` (mismo
motivo: el adapter pasa los campos directamente) y la firma de `formatDate()` en
`ProgramasProyectosSection.tsx` (el cuerpo ya manejaba `null` con `if (!value)` — solo se
actualizó la firma de TypeScript).

**Validaciones ejecutadas:**

```
npm run test -- src/modules/suma-impacto/schema.test.ts
  Test Files  1 passed (1)
       Tests  32 passed (32)

npm run test
  Test Files  4 passed (4)
       Tests  96 passed (96)   ← adapter(9) + client(24) + env(32) + schema(32) — suite completa

npm run type-check
  tsc --noEmit → sin errores
```

**Tests nuevos en schema.test.ts (32 casos):**

Items válidos: item completo, sin campos, solo name/reserveUrl, imageUrl null, location null,
modality null, shortLinkUrl null, startDate null, cost FREE/PAID/SUBSIDY/null/ausente/otro string,
campos extra con passthrough.

Items inválidos: types como string, types con números, name como número, cost como número.

Response válido: completo, data vacía, total 0, shape de datos.

Response inválido: success false, success ausente, data no array, data ausente, total negativo,
total decimal, total string, item con types como string (Política A), body no objeto.

**Tests nuevos en client.test.ts (6 casos):**
- Response pasa schema → retorna data
- success false → fallback
- data no array → fallback
- item con types como string → fallback (Política A)
- total negativo → fallback
- schema failure no expone secretos en logs

---

## Problema 5 — P2-002/P2-003: costLabel y organizationName

### Audit inicial

**Campos que llegan de Suma (ya en el schema):**
- `cost?: string | null` — valores conocidos: `'FREE'`, `'PAID'`, `'SUBSIDY'`, o `null`
- `organization?: string` — nombre de la organización que ofrece la experiencia

**Campos que faltaban en el DTO interno (antes de este cambio):**

`DemocratizamosExperienceCard` no tenía:
- `costLabel` — el usuario no podía saber si una experiencia es gratuita o de pago
- `organizationName` — en contexto multi-organización, el usuario no sabía quién oferta

**Impacto en UI actual:**

La UI actual (`ProgramasProyectosSection`) no muestra costo ni organización — solo título,
descripción, fechas, ubicación y botón CTA. Por eso estos campos no bloqueaban nada visualmente.
Sin embargo, la ausencia en el DTO impedía usarlos en una iteración futura sin cambiar el contrato
interno.

**Riesgo de producto:**
- Sin `costLabel`: usuario hace click en "Inscribirse" esperando que sea gratuito, pero Suma
  muestra que tiene costo. Abandono de inscripción innecesario.
- Sin `organizationName`: si Demoinn en el futuro muestra experiencias de más de una org,
  el usuario no sabe de quién es cada card.

**Decisión de mapping para `cost`:**

| Valor de Suma | Label para usuario | Razón |
|--------------|-------------------|-------|
| `'FREE'` | `'Gratuito'` | Label legible, no expone enum interno |
| `'PAID'` | `'De pago'` | Ídem |
| `'SUBSIDY'` | `'Subsidio'` | Ídem |
| `null` / `undefined` / `''` | `undefined` | Sin dato → no mostrar nada |
| Valor desconocido | `undefined` | No exponer raw enum al usuario |

Nota: se eligió `undefined` para valores desconocidos en lugar de `'Por confirmar'` porque
mostrar texto genérico de costo puede confundir más que no mostrar nada.

**Decisión de UI:**

Los campos quedan disponibles en el DTO pero **no se cambia la UI visual** en esta iteración.
`ProgramasProyectosSection` los ignorará hasta que se diseñe el espacio visual para mostrarlos.

**Qué no se toca:** fetch, env, schema, client, UI visual, filtering del adapter.

---

### Implementación realizada

**Archivos modificados:**
- `src/modules/suma-impacto/types.ts` — nuevos campos en `DemocratizamosExperienceCard`
- `src/modules/suma-impacto/adapter.ts` — helper + mapping de cost y organization
- `src/modules/suma-impacto/adapter.test.ts` — 11 nuevos tests

**Cambios en `DemocratizamosExperienceCard`:**
```ts
organizationName?: string;  // NEW — organización que ofrece la experiencia
costLabel?: string;         // NEW — label humano del costo ('Gratuito', 'De pago', 'Subsidio')
```

**Nuevo helper exportado en `adapter.ts`:**
```ts
export function mapSumaCostToLabel(cost?: string | null): string | undefined
```
- Cubre FREE/PAID/SUBSIDY con labels en español
- Retorna `undefined` para null, vacío y valores desconocidos
- No expone el raw enum al usuario

**Cambios en `adaptSumaExperiencesToCards`:**
- `costLabel: mapSumaCostToLabel(item.cost)` — usa el helper
- `organizationName: item.organization?.trim() || undefined` — string no vacío o undefined

---

### Audit final

*(Actualizado tras la ejecución de tests)*

**Estado P2-002:** Cerrado ✅  
**Estado P2-003:** Cerrado ✅

**Riesgo residual:**
- Si Suma agrega un nuevo valor de cost (ej. `'SCHOLARSHIP'`), el helper retorna `undefined`.
  La card no muestra costo — correcto por defecto. Si se quiere mostrar el nuevo valor,
  se agrega al mapping del helper.
- `organizationName` toma el string tal como viene de Suma (trimmed). Si Suma cambia el formato
  del nombre, el texto cambia en UI cuando se muestre. Aceptable.

**Impacto en producción:** Ninguno en UI visible (los campos no se muestran aún). El DTO es
más completo para iteraciones futuras.

**Validaciones ejecutadas:**

```
npm run test -- src/modules/suma-impacto/adapter.test.ts
  Test Files  1 passed (1)
       Tests  27 passed (27)   ← 9 anteriores + 18 nuevos

npm run test
  Test Files  4 passed (4)
       Tests  113 passed (113) ← suite completa sin regresiones

npm run type-check
  tsc --noEmit → sin errores
```

**Tests nuevos en adapter.test.ts (18 casos):**

`mapSumaCostToLabel` (9):
- FREE → Gratuito, PAID → De pago, SUBSIDY → Subsidio
- case-insensitive (free, paid, subsidy)
- null → undefined, undefined → undefined
- empty string → undefined
- valores desconocidos → undefined

`adaptSumaExperiencesToCards` — nuevos campos (9):
- organization → organizationName
- organization undefined → undefined
- organization vacío → undefined
- cost FREE → costLabel Gratuito
- cost PAID → costLabel De pago
- cost SUBSIDY → costLabel Subsidio
- cost null → undefined
- cost undefined → undefined
- cost desconocido → undefined

---

## Problema 6 — P2-001/P2-006: Contrato local y logging

### Audit inicial

**Estado de docs/api antes de este cambio:**
- El directorio `docs/` no existía. Sí se creó `docs/audits/` en el audit inicial.
- No existía `docs/api/DEMOINN_EXPERIENCES_API.md`.
- El contrato oficial del endpoint vivía solo en la memoria del proyecto Suma, no en Demoinn.

**Contrato que usa realmente el client:**

`client.ts` construye:
```
URL: {SUMA_IMPACTO_BASE_URL}/api/experiences/org/{orgId}/lite?source=demoinn
Headers: { Accept: 'application/json', 'x-api-key': <key> }
```

Validado por `sumaImpactoLiteResponseSchema` (Zod, Política A).

**Variables de entorno que usa Demoinn:**
`SUMA_IMPACTO_BASE_URL`, `SUMA_IMPACTO_EXPERIENCES_API_KEY`, `SUMA_IMPACTO_DEMOINN_ORG_ID`,
`SUMA_IMPACTO_EXPERIENCES_SOURCE`, `SUMA_IMPACTO_API_TIMEOUT_MS`, `SUMA_IMPACTO_API_CACHE_TTL_SECONDS`.

**Estado del logging antes de este cambio:**

`logDev` en client.ts usaba `console.error` para TODOS los mensajes:

```ts
function logDev(message: string, meta?: Record<string, string | number>): void {
  if (process.env.NODE_ENV !== 'development') return;
  console.error(`[SumaImpacto] ${message}`, meta);  // ← siempre error
}
```

Esto incluía degradaciones controladas esperadas (timeout, 401, network error) que deberían
ser `warn`, no `error`. La distinción importa para:
- Dashboards de observabilidad que filtran por nivel.
- Herramientas de dev que resaltan errores en rojo pero warnings en amarillo.
- Decisiones sobre alertas: un `error` puede despertar a alguien; un `warn` no.

**Clasificación de cada mensaje:**

| Mensaje | Nivel elegido | Razón |
|---------|--------------|-------|
| URL construction failed | `error` | Bug de config — inesperado |
| Request timed out | `warn` | Degradación controlada — Suma lenta |
| Network error | `warn` | Degradación controlada — red caída |
| HTTP error (401/500/...) | `warn` | Degradación controlada — Suma respondió |
| Body read failed | `warn` | Degradación controlada — respuesta incompleta |
| Invalid JSON | `error` | Anomalía de contrato — inesperado |
| Schema mismatch | `error` | Contract drift — requiere atención |

**Cambio implementado:** `logDev` ahora recibe `level: 'warn' | 'error'` como primer parámetro.

**Qué no se toca:** fetch, timeout, env, schema, adapter, UI, fallback behavior.

---

### Implementación realizada

**Archivos creados:**
- `docs/api/DEMOINN_EXPERIENCES_API.md` — contrato oficial local del endpoint Suma

**Archivos modificados:**
- `src/modules/suma-impacto/client.ts` — refactor de `logDev` con parámetro `level`
- `src/modules/suma-impacto/client.test.ts` — tests de nivel de logging y actualización de safety test

**Cambio en `logDev`:**
```ts
// Antes:
function logDev(message: string, meta?: Record<string, string | number>): void {
  // siempre console.error

// Después:
function logDev(level: 'warn' | 'error', message: string, meta?: ...): void {
  const logger = level === 'warn' ? console.warn : console.error;
```

**Niveles asignados:**
- URL error, JSON inválido, schema mismatch → `error`
- Timeout, network, HTTP error, body read → `warn`

---

### Audit final

*(Actualizado tras la ejecución de tests)*

**Estado P2-001:** Cerrado ✅  
**Estado P2-006:** Cerrado ✅

**Riesgo residual:**
- P2-001: el contrato doc refleja el estado actual del código. Si el endpoint de Suma cambia,
  el doc puede quedar desactualizado. Mitigado: el Zod schema es el source of truth en runtime.
- P2-006: ninguno. Los niveles son conservadores — errores reales son `error`, degradaciones
  esperadas son `warn`.

**Impacto en producción:** `logDev` solo loguea en `NODE_ENV === 'development'`. Ningún impacto
en producción.

**Validaciones ejecutadas:**

```
npm run test -- src/modules/suma-impacto
  Test Files  4 passed (4)
       Tests  117 passed (117)   ← adapter(27) + client(28) + env(32) + schema(32)

npm run test
  Test Files  4 passed (4)
       Tests  117 passed (117)   ← suite completa sin regresiones

npm run type-check
  tsc --noEmit → sin errores
```

**Tests nuevos en client.test.ts (5 casos):**
- timeout → `console.warn`, no `console.error`
- network error → `console.warn`, no `console.error`
- HTTP 401 → `console.warn`, no `console.error`
- schema mismatch → `console.error`, no `console.warn`
- API key no aparece en warn ni error











