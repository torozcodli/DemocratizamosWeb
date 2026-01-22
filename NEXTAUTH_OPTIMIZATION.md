# Optimización NextAuth: Reducción de Llamadas a /api/auth/session

## 🔍 Problema Identificado

En Vercel logs se observaban **MUCHAS llamadas repetidas** a `GET /api/auth/session` por cada navegación/render, causando:
- Sobrecarga innecesaria del servidor
- Latencia adicional en cada carga de página
- Costos incrementales en Vercel

## ✅ Solución Implementada

### 1. SessionProvider Optimizado con Session Inicial

**Antes:**
```typescript
// SessionProvider no recibía session inicial
export function SessionProvider({ children }) {
  return <NextAuthSessionProvider>{children}</NextAuthSessionProvider>;
}
```

**Después:**
```typescript
// SessionProvider recibe session desde server y desactiva polling
export function SessionProvider({ children, session }) {
  return (
    <NextAuthSessionProvider
      session={session}
      refetchOnWindowFocus={false}
      refetchInterval={0}
      refetchWhenOffline={false}
    >
      {children}
    </NextAuthSessionProvider>
  );
}
```

**Resultado:** 
- ✅ Session se obtiene UNA VEZ en el servidor
- ✅ No hay polling automático
- ✅ No hay refetch en window focus
- ✅ Componentes cliente usan session del provider sin fetch adicional

### 2. Layout.tsx Obtiene Session en Server

**Antes:**
```typescript
export default function RootLayout({ children }) {
  return (
    <SessionProvider>
      {children}
    </SessionProvider>
  );
}
```

**Después:**
```typescript
export default async function RootLayout({ children }) {
  // Obtener sesión UNA VEZ en el servidor
  const session = await getServerSession(authOptions);
  
  return (
    <SessionProvider session={session}>
      {children}
    </SessionProvider>
  );
}
```

**Resultado:**
- ✅ Session se obtiene en server-side (más rápido)
- ✅ Session se pasa al provider (evita fetch cliente)
- ✅ Todos los componentes hijos tienen acceso a session sin fetch

### 3. ProgramasProyectosSection Optimizado

**Antes:**
```typescript
// Componente cliente usando useSession() → fetch a /api/auth/session
export function ProgramasProyectosSection() {
  const { data: session } = useSession(); // ❌ Llamada cliente
  // ...
}
```

**Después:**
```typescript
// Componente recibe session como prop desde server
export function ProgramasProyectosSection({ session }) {
  // ✅ No hay fetch, usa prop directamente
  // ...
}
```

**En programas/page.tsx:**
```typescript
export default async function ProgramasPage() {
  const session = await getServerSession(authOptions); // Server-side
  return <ProgramasProyectosSection session={session} />;
}
```

**Resultado:**
- ✅ Eliminada llamada cliente a `/api/auth/session`
- ✅ Session obtenida en server (más eficiente)
- ✅ Mismo comportamiento, mejor rendimiento

## 📊 Componentes Afectados

### Componentes Optimizados:
1. ✅ **SessionProvider** - Ahora recibe session inicial y desactiva polling
2. ✅ **RootLayout** - Obtiene session en server y la pasa al provider
3. ✅ **ProgramasProyectosSection** - Recibe session como prop (eliminado useSession)

### Componentes que Mantienen useSession (Necesario):
1. ✅ **CreateBlogModal** - Modal interactivo que necesita session reactiva
   - **Nota:** Ahora usa session del provider (sin fetch adicional gracias a session inicial)

### Componentes Server (Ya Optimizados):
- ✅ Todas las páginas admin usan `getServerSession()` (correcto)
- ✅ Todas las API routes usan `getServerSession()` (correcto)

## 🎯 Resultados Esperados

### Antes de la Optimización:
- ❌ Cada componente con `useSession()` → 1 llamada a `/api/auth/session`
- ❌ SessionProvider sin session inicial → 1 llamada al montar
- ❌ Polling automático activado → llamadas periódicas
- ❌ Refetch en window focus → llamadas al cambiar de pestaña
- **Total estimado:** 3-5+ llamadas por carga de página

### Después de la Optimización:
- ✅ Session obtenida UNA VEZ en server (layout.tsx)
- ✅ Session pasada al provider (sin fetch cliente)
- ✅ Polling desactivado (refetchInterval: 0)
- ✅ Refetch en focus desactivado (refetchOnWindowFocus: false)
- ✅ Componentes reciben session como prop cuando es posible
- **Total estimado:** 0-1 llamadas por carga de página (solo si es necesario)

## 🧪 Verificación

### Paso 1: Verificar en DevTools Network

1. Abre DevTools (F12) → Pestaña **Network**
2. Filtra por: `Fetch/XHR`
3. Navega: `/inicio` → `/programas` → `/nosotros` → `/inicio`
4. **Debe mostrar:**
   - ✅ Muy pocas o ninguna llamada a `/api/auth/session`
   - ✅ Solo llamadas necesarias (no repetidas)

### Paso 2: Verificar en Vercel Logs

1. Ve a Vercel Dashboard → Proyecto → Logs
2. Filtra por: `/api/auth/session`
3. Navega por el sitio
4. **Debe mostrar:**
   - ✅ Drástica reducción en llamadas a `/api/auth/session`
   - ✅ No hay llamadas repetidas por cada navegación

### Paso 3: Verificar Funcionalidad

1. **Sin sesión:**
   - Navegar funciona correctamente
   - Botones admin no aparecen (correcto)

2. **Con sesión:**
   - Login funciona correctamente
   - Botones admin aparecen donde corresponde
   - CreateBlogModal funciona
   - ProgramasProyectosSection muestra botón admin si es admin

## 📝 Archivos Modificados

1. **src/components/providers/SessionProvider.tsx**
   - Agregado prop `session` opcional
   - Desactivado polling y refetch automático

2. **src/app/layout.tsx**
   - Convertido a `async function`
   - Agregado `getServerSession()` para obtener session
   - Session pasada a SessionProvider

3. **src/components/sections/programas/ProgramasProyectosSection.tsx**
   - Eliminado `useSession()` hook
   - Agregado prop `session` opcional
   - Session recibida desde server

4. **src/app/programas/page.tsx**
   - Convertido a `async function`
   - Agregado `getServerSession()` para obtener session
   - Session pasada a ProgramasProyectosSection

## ⚠️ Notas Importantes

1. **CreateBlogModal:** Mantiene `useSession()` porque es un modal interactivo que necesita session reactiva. Sin embargo, ahora usa la session del provider (sin fetch adicional).

2. **Compatibilidad:** Los cambios son backward compatible. Si un componente no recibe session como prop, puede seguir usando `useSession()` (aunque será menos eficiente).

3. **Server Components:** Todas las páginas que necesitan session en server ya usan `getServerSession()` correctamente.

4. **No se modificó:** Login con Google, signIn/signOut, ni middleware (como se solicitó).

## 🚀 Próximos Pasos

1. **Desplegar a staging/preview**
2. **Verificar logs en Vercel** - Confirmar reducción de llamadas
3. **Probar funcionalidad** - Asegurar que todo funciona correctamente
4. **Monitorear** - Verificar que no hay regresiones

## 📊 Métricas Esperadas

- **Reducción estimada:** 70-90% menos llamadas a `/api/auth/session`
- **Mejora de rendimiento:** Menos latencia en carga de páginas
- **Reducción de costos:** Menos invocaciones en Vercel
