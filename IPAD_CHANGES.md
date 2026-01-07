# Cambios de iPad - Para restaurar después

Este documento contiene todos los cambios específicos de iPad que se aplicaron antes de revertir para restaurar web.

## Archivos modificados

### 1. `src/app/globals.css`

#### Cambios en `.hero-man-container` para iPad:

```css
/* Fix para hacer el señor más chico solo en iPad - NO afectar desktop */
@media (min-width: 768px) and (max-width: 1023px) {
  .hero-man-container {
    width: 68% !important;
    transform: translateX(calc(2px + 1.5cm)) scale(1.05) !important;
  }
}
@media (min-width: 1024px) and (max-width: 1279px) {
  .hero-man-container {
    width: 70% !important;
    transform: translateX(2px) scale(1.05) !important;
  }
}
/* Desktop - NO aplicar ningún estilo, dejar que las clases de Tailwind funcionen */
```

**Ubicación:** Después de la línea 144 (después de `.about-logo-container`)

### 2. `src/components/landing/HeroIllustration.tsx`

#### Cambios en el contenedor del señor:

**Línea 65:** Agregar clase `hero-man-container` al div del señor:

```tsx
<div className="hero-man-container absolute right-[-54%] translate-x-[2px] bottom-[calc(30%+4.5cm-15px)] md:right-[-54%] md:translate-x-[2px] md:bottom-[calc(40%+6.5cm-15px)] lg:right-[-54%] lg:translate-x-[2px] lg:bottom-[calc(35%+6.5cm-15px)] xl:bottom-[calc(35%+6.5cm-15px)] w-[64%] md:w-[66%] lg:w-[70%] xl:w-[70%] aspect-[3/4] relative z-40 pointer-events-none">
```

**Nota:** La clase `hero-man-container` es necesaria para que el CSS de iPad funcione.

## Resumen de cambios

### iPad (768-1023px):
- Width del señor: `68%` (con `!important`)
- Transform: `translateX(calc(2px + 1.5cm)) scale(1.05)` (con `!important`)

### iPad Pro (1024-1279px):
- Width del señor: `70%` (con `!important`)
- Transform: `translateX(2px) scale(1.05)` (con `!important`)

### Desktop (1280px+):
- NO se aplican estilos CSS, solo las clases de Tailwind del HTML funcionan

## Instrucciones para restaurar

1. Agregar el CSS en `src/app/globals.css` después de la línea 144
2. Asegurarse de que el div del señor en `HeroIllustration.tsx` tenga la clase `hero-man-container`
3. Verificar que desktop NO tenga ningún `@media (min-width: 1280px)` que afecte `.hero-man-container`

## Estado actual

- ✅ Web restaurado al commit anterior
- ✅ Cambios de iPad documentados
- ⏳ Pendiente: Aplicar cambios de iPad de nuevo y ajustar

