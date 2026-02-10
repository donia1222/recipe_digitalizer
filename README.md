# Recipe Digitizer

PWA para digitalizar, gestionar y analizar recetas mediante inteligencia artificial. Desarrollada para el Altersheim Gärbi (Suiza).

## Stack Tecnológico

| Tecnología | Versión |
|------------|---------|
| Next.js (App Router) | 15.2.6 |
| React | 19 |
| TypeScript | 5 |
| Tailwind CSS | 3.4.17 |
| ShadCN/UI + Radix UI | — |
| Framer Motion | — |
| Lucide React | 0.454 |

## Funcionalidades Principales

### Digitalización con IA
- Captura por cámara, upload de imagen o scanner de documentos
- Análisis automático via [FoodScan AI](https://foodscan-ai.com) (GPT-4.1)
- Extracción de título, ingredientes, instrucciones y porciones
- Recálculo inteligente de porciones con IA

### Gestión de Recetas
- CRUD completo con vistas grid/list
- Favoritos, historial, búsqueda en tiempo real
- Compartir, imprimir y galería de múltiples imágenes
- Sistema de comentarios con likes interactivos
- Archivo y categorización de recetas

### Sistema de Roles

| Rol | Acceso | Permisos |
|-----|--------|----------|
| **Admin** | Contraseña | Dashboard completo, aprobar recetas, gestionar usuarios |
| **Mitarbeiter** | Directo | Crear recetas, comentar, editar propias, ajustar porciones |
| **Gast** | Directo | Ver recetas, buscar, leer comentarios (solo lectura) |

### Panel de Administración
- Estadísticas en tiempo real
- Cola de aprobación de recetas pendientes
- Gestión de usuarios y sub-administradores
- CRUD masivo de recetas

### PWA
- Instalable en móvil y desktop
- Modo offline con Service Worker (cache-first)
- Orientación portrait optimizada

## Estructura del Proyecto

```
├── app/                        # Next.js App Router
│   ├── layout.tsx              # Layout principal + PWA
│   ├── page.tsx                # Página principal (AppWrapper)
│   ├── admin/page.tsx          # Panel de administración
│   ├── recipe-archive/page.tsx # Archivo de recetas
│   └── offline/page.tsx        # Página offline
│
├── components/                 # ~70 componentes React
│   ├── app-wrapper.tsx         # Orquestador principal
│   ├── recipe-digitizer.tsx    # Contenedor principal de la app
│   ├── home-dashboard.tsx      # Dashboard con acciones
│   ├── recipe-analyzer.tsx     # Visualización/edición de recetas
│   ├── recipe-library.tsx      # Biblioteca grid/list
│   ├── recipe-comments.tsx     # Comentarios + likes
│   ├── servings-modal.tsx      # Ajuste de porciones
│   ├── admin/                  # 5 componentes de administración
│   └── ui/                     # 55+ componentes ShadCN/Radix
│
├── lib/
│   ├── actions.ts              # Server Actions (llamadas a IA)
│   ├── utils.ts                # Utilidades helper
│   └── services/               # Capa de abstracción de datos
│       ├── authService.ts      # Autenticación multi-rol
│       ├── recipeService.ts    # CRUD de recetas
│       ├── userService.ts      # Gestión de usuarios
│       ├── commentService.ts   # Comentarios + likes
│       └── api-config.ts       # Configuración API
│
├── apis/                       # Backend PHP/MySQL
│   ├── auth-simple.php
│   ├── recipes-simple.php
│   ├── comments.php
│   ├── users.php
│   ├── pending-recipes.php
│   ├── categories-simple.php
│   └── favorites.php
│
├── public/                     # Assets PWA
│   ├── manifest.json
│   ├── sw.js                   # Service Worker
│   └── icons/                  # Iconos (72px - 512px)
│
└── types/index.ts              # Interfaces TypeScript
```

## APIs y Servicios

### Backend Propio (PHP/MySQL)
- **Base URL:** `https://web.lweb.ch/recipedigitalizer/apis/`
- Comentarios, usuarios, recetas, favoritos, categorías
- Autenticación y permisos por usuario

### FoodScan AI (Externo)
- `responseImageAnalysis.php` — Análisis de imagen de receta
- `responseChat.php` — Recálculo de porciones

## Instalación

```bash
# 1. Clonar repositorio
git clone <url-del-repo>
cd recipe-digitizer-main

# 2. Instalar dependencias
npm install --legacy-peer-deps

# 3. Configurar variables de entorno
cp .env.example .env.local
# Editar .env.local con tus valores
```

### Variables de Entorno

```bash
NEXT_PUBLIC_RECIPE=          # Contraseña de administrador
# Futuras (para migración BD):
# DATABASE_URL=              # Conexión MySQL
# JWT_SECRET=                # Secret para tokens
# CLOUDINARY_URL=            # CDN de imágenes
```

## Desarrollo

```bash
npm run dev          # Servidor de desarrollo (http://localhost:3000)
npm run build        # Build de producción
npm run start        # Iniciar en producción
npm run lint         # Linting
```

## Despliegue

### Vercel (Recomendado)
Configuración incluida en `vercel.json`. Deploy directo desde GitHub.

### Self-hosted
Requiere Node.js 18+. Usar PM2 para mantener la app activa:
```bash
npm run build
pm2 start npm --name "recipe-app" -- start
```

## Base de Datos

**Producción:** MySQL en Hostpoint con tablas `comments` y `users`.

**Desarrollo:** localStorage como fallback (límite ~10MB).

La capa de servicios (`lib/services/`) abstrae el acceso a datos, permitiendo cambiar entre localStorage y MySQL sin modificar componentes.

## Arquitectura

```
[Usuario] → [Next.js App Router]
                  │
                  ├── [Server Actions] → [FoodScan AI]
                  │
                  ├── [Services Layer] → [PHP APIs] → [MySQL]
                  │
                  └── [localStorage] (cache local)
```

---

Desarrollado para **Altersheim Gärbi** | Next.js 15 + React 19 + TypeScript
