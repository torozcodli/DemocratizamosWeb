# Democratizamos la Innovación - Landing Page

Landing page frontend para Democratizamos la Innovación, una asociación civil sin fines de lucro comprometida con cerrar la brecha digital en México.

## 🚀 Stack Tecnológico

- **Framework**: Next.js 16 (App Router)
- **Lenguaje**: TypeScript
- **Estilos**: Tailwind CSS
- **Validación**: Zod
- **Íconos**: Lucide React
- **Temas**: next-themes (preparado para dark mode)
- **Animaciones**: framer-motion (instalado, listo para usar)

## 📦 Setup

```bash
# Instalar dependencias
npm install

# Ejecutar en desarrollo
npm run dev

# Build para producción
npm run build

# Iniciar servidor de producción
npm start
```

## 📝 Scripts Disponibles

- `npm run dev` - Inicia el servidor de desarrollo
- `npm run build` - Construye la aplicación para producción
- `npm run start` - Inicia el servidor de producción
- `npm run lint` - Ejecuta ESLint
- `npm run format` - Formatea el código con Prettier

## 📁 Estructura del Proyecto

```
src/
├── app/                    # App Router de Next.js
│   ├── layout.tsx         # Layout principal
│   ├── page.tsx           # Página de inicio
│   ├── globals.css         # Estilos globales
│   ├── sitemap.ts         # Sitemap
│   └── robots.ts           # Robots.txt
├── components/
│   ├── providers/         # Providers (Theme, etc.)
│   ├── ui/                # Componentes UI base
│   │   ├── Button.tsx
│   │   ├── Container.tsx
│   │   ├── Input.tsx
│   │   ├── Logo.tsx
│   │   └── SectionHeading.tsx
│   └── sections/          # Secciones de la landing
│       ├── Navbar.tsx
│       ├── Hero.tsx
│       ├── About.tsx
│       ├── Values.tsx
│       ├── Stats.tsx
│       ├── Allies.tsx
│       ├── News.tsx
│       ├── Contact.tsx
│       ├── Footer.tsx
│       ├── Programs.tsx
│       ├── Blog.tsx
│       ├── Tools.tsx
│       └── Academy.tsx
├── config/
│   └── site.ts            # Configuración del sitio
├── content/
│   └── home.ts            # Contenido de la página de inicio
├── lib/
│   ├── utils/
│   │   └── cn.ts          # Utility para clases CSS
│   ├── validation/
│   │   └── contact.schemas.ts  # Schemas de validación (Zod)
│   ├── controllers/
│   │   └── contactController.ts  # Controladores (preparado para backend)
│   └── api/
│       └── responses.ts   # Helpers de respuestas API
└── types/
    └── standardResponse.ts  # Tipos TypeScript

public/
├── allies/                # Logos de aliados
└── images/                # Imágenes generales
```

## 🎨 Características

- ✅ **100% Frontend** - Sin backend por ahora, estructura lista para agregarlo
- ✅ **Responsive** - Diseño adaptativo para todos los dispositivos
- ✅ **Accesible** - Semántica HTML correcta, ARIA labels, focus visible
- ✅ **SEO Optimizado** - Metadata, sitemap, robots.txt
- ✅ **Estructura Escalable** - Preparada para:
  - Animaciones (framer-motion instalado)
  - Backend/API routes
  - Dark mode (next-themes configurado)
  - Validación de formularios (Zod listo)

## 🔄 Próximos Pasos

### Animaciones
- Agregar animaciones con framer-motion en las secciones
- Transiciones suaves al hacer scroll
- Efectos hover mejorados

### Backend
- Implementar API route `/api/contact` para el formulario
- Conectar con base de datos o servicio de email
- Agregar más endpoints según necesidad

### Contenido
- Agregar imágenes reales en `public/images`
- Reemplazar logos placeholder en `public/allies`
- Completar secciones placeholder (Programas, Blog, Herramientas, Academia)

## 📄 Licencia

ISC

