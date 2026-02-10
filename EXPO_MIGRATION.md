# Recipe Digitizer - Guia Completa para App Nativa con Expo

## 1. Resumen del Proyecto PWA Actual

**Nombre**: Recipe Digitizer
**Cliente**: Altersheim Garbi (Residencia de ancianos, Suiza)
**Idioma UI**: Aleman (Deutsch)
**URL Produccion**: Desplegado en Vercel + Backend en Hostpoint
**Estado**: PWA funcional en produccion (~95% frontend, ~85% backend)

### Que Hace la App
App de digitalizacion, gestion y analisis de recetas con IA. Permite:
- Fotografiar/escanear recetas fisicas y digitalizarlas con IA (GPT-4.1)
- CRUD completo de recetas con imagenes multiples
- Sistema de 3 roles (Admin/Worker/Guest)
- Comentarios con likes en recetas
- Ajuste inteligente de porciones via IA
- Panel de administracion completo
- Sistema de aprobacion de recetas (workers envian, admin aprueba)
- Favoritos, busqueda, categorias
- Creacion manual de recetas
- Compartir, imprimir, descargar como imagen

---

## 2. Stack Tecnologico PWA (Actual)

| Capa | Tecnologia |
|------|-----------|
| Framework | Next.js 15.2.6 (App Router) |
| Frontend | React 19, TypeScript |
| Styling | Tailwind CSS 3.4.17 |
| UI Components | ShadCN/UI + Radix UI |
| Animaciones | Framer Motion |
| Iconos | Lucide React |
| Forms | React Hook Form + Zod |
| Charts | Recharts |
| Backend API | PHP 8+ con MySQL (Hostpoint) |
| IA | FoodScan AI (GPT-4.1) |
| Deploy Frontend | Vercel |
| Deploy Backend | Hostpoint (FTP) |
| PWA | Service Worker nativo |

---

## 3. Arquitectura Backend (Se Mantiene Igual)

### Base URL API
```
https://web.lweb.ch/recipedigitalizer/apis/
```

### Endpoints PHP Existentes

| Archivo | Metodo | Endpoint | Descripcion |
|---------|--------|----------|-------------|
| `recipes-simple.php` | GET | `?id=X` | Obtener receta por ID |
| `recipes-simple.php` | GET | `?user_id=X&page=1&limit=6` | Listar recetas (paginado) |
| `recipes-simple.php` | POST | `/` | Crear receta (admin=aprobada, worker=pendiente) |
| `recipes-simple.php` | PUT | `?id=X` | Actualizar receta |
| `recipes-simple.php` | DELETE | `?id=X` | Eliminar receta |
| `comments.php` | GET | `?recipe_id=X` | Comentarios de receta |
| `comments.php` | POST | `/` | Crear comentario |
| `comments.php` | PUT | `?id=X` | Editar comentario / toggle like |
| `comments.php` | DELETE | `?id=X&user_id=Y&user_role=Z` | Eliminar comentario |
| `users.php` | GET | `/` o `?id=X` | Listar/obtener usuarios |
| `users.php` | POST | `/` | Crear usuario |
| `users.php` | PUT | `?id=X` | Actualizar usuario |
| `users.php` | DELETE | `?id=X` | Eliminar usuario |
| `auth-simple.php` | POST | `?action=login` | Login (username+password) |
| `auth-simple.php` | GET | `?action=verify` | Verificar sesion |
| `favorites.php` | GET | `?user_id=X` | Obtener favoritos |
| `favorites.php` | POST | `/` | Toggle favorito |
| `pending-recipes.php` | GET | `/` o `?stats=true` | Recetas pendientes / estadisticas |
| `pending-recipes.php` | POST | `/` | Aprobar/rechazar receta |
| `categories-simple.php` | GET/POST/PUT/DELETE | `/` | CRUD categorias |

### Configuracion Backend (.config)
```
DB_HOST=mysql.hostpoint.ch
DB_NAME=recipe_digitizer
DB_USER=***
DB_PASS=***
JWT_SECRET=***
ADMIN_PASSWORD=***
ALLOWED_ORIGIN=*
UPLOAD_URL=https://web.lweb.ch/recipedigitalizer/uploads/
```

### APIs Externas (IA)
```
# Analisis de imagen de receta
POST https://foodscan-ai.com/responseImageAnalysis.php
Body: { model: "gpt-4.1", messages: [...], max_tokens: 1000 }

# Recalculo de porciones
POST https://foodscan-ai.com/responseChat.php
Body: { model: "gpt-4.1", messages: [...], max_tokens: 1000 }
```

---

## 4. Base de Datos MySQL - Esquema Completo

### Tablas Principales

```sql
-- USUARIOS
CREATE TABLE users (
    id VARCHAR(36) PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE,
    password VARCHAR(255),           -- BCrypt hash (NULL para workers/guests)
    role ENUM('admin','worker','guest') DEFAULT 'guest',
    avatar VARCHAR(50) DEFAULT '👤',
    active BOOLEAN DEFAULT TRUE,
    last_active DATETIME,
    recipes_created INT DEFAULT 0,
    permissions JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- RECETAS
CREATE TABLE recipes (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recipe_id VARCHAR(100) UNIQUE,    -- ID string para compartir
    title VARCHAR(500),
    ingredients TEXT,                  -- JSON array
    instructions TEXT,
    analysis TEXT,                     -- Texto completo del analisis IA
    image_url VARCHAR(500),           -- URL imagen principal
    image_base64 LONGTEXT,            -- Respaldo base64
    user_id VARCHAR(36),
    folder_id VARCHAR(100),
    status ENUM('pending','approved','rejected') DEFAULT 'pending',
    servings INT,
    original_servings INT,
    is_favorite BOOLEAN DEFAULT FALSE,
    prep_time INT,
    cook_time INT,
    difficulty ENUM('easy','medium','hard') DEFAULT 'medium',
    category VARCHAR(100),
    category_id INT,
    tags JSON,
    views INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL
);

-- RECETAS PENDIENTES (misma estructura que recipes)
CREATE TABLE recetas_pendientes (
    -- Mismos campos que recipes
    -- Workers/guests insertan aqui, admin aprueba y mueve a recipes
);

-- IMAGENES ADICIONALES
CREATE TABLE recipe_images (
    id INT PRIMARY KEY AUTO_INCREMENT,
    recipe_id INT NOT NULL,
    image_url VARCHAR(500),
    image_base64 LONGTEXT,
    caption VARCHAR(255),
    display_order INT DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- IMAGENES PENDIENTES
CREATE TABLE recetas_pendientes_images (
    -- Misma estructura que recipe_images para pendientes
);

-- COMENTARIOS
CREATE TABLE comments (
    id VARCHAR(36) PRIMARY KEY,
    recipe_id INT NOT NULL,
    user_id VARCHAR(36),
    author_name VARCHAR(255),
    author_role ENUM('admin','worker','guest') DEFAULT 'guest',
    content TEXT NOT NULL,
    likes INT DEFAULT 0,
    liked_by JSON,                    -- Array de user_ids
    is_edited BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- FAVORITOS (Many-to-Many)
CREATE TABLE user_favorites (
    user_id VARCHAR(36) NOT NULL,
    recipe_id INT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    PRIMARY KEY (user_id, recipe_id),
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (recipe_id) REFERENCES recipes(id) ON DELETE CASCADE
);

-- CATEGORIAS
CREATE TABLE recipe_categories (
    id INT PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(100) NOT NULL,
    color VARCHAR(20) DEFAULT '#3b82f6',
    parent_id INT,
    user_id VARCHAR(36),
    display_order INT DEFAULT 0,
    is_active BOOLEAN DEFAULT TRUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- SESIONES
CREATE TABLE sessions (
    id VARCHAR(128) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL,
    ip_address VARCHAR(45),
    user_agent TEXT,
    payload TEXT,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- SUB-ADMINISTRADORES
CREATE TABLE sub_admins (
    id VARCHAR(36) PRIMARY KEY,
    user_id VARCHAR(36) NOT NULL UNIQUE,
    can_approve_recipes BOOLEAN DEFAULT FALSE,
    can_manage_users BOOLEAN DEFAULT FALSE,
    can_delete_content BOOLEAN DEFAULT FALSE,
    can_view_analytics BOOLEAN DEFAULT FALSE,
    assigned_by VARCHAR(36),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- LOG DE AUDITORIA
CREATE TABLE audit_log (
    id INT PRIMARY KEY AUTO_INCREMENT,
    user_id VARCHAR(36),
    action VARCHAR(100) NOT NULL,
    entity_type VARCHAR(50),
    entity_id VARCHAR(36),
    details JSON,
    ip_address VARCHAR(45),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- CONFIGURACION APP
CREATE TABLE app_config (
    config_key VARCHAR(100) PRIMARY KEY,
    config_value TEXT,
    description VARCHAR(255),
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);
```

### Stored Procedures
```sql
CALL sp_approve_recipe(recipe_id, approved_by);  -- Aprobar receta
CALL sp_increment_views(recipe_id);              -- Incrementar vistas
CALL sp_toggle_favorite(user_id, recipe_id);     -- Toggle favorito
```

---

## 5. Sistema de Autenticacion y Roles

### 3 Roles

| Rol | Acceso | Capacidades |
|-----|--------|-------------|
| **admin** | Password (BCrypt) | Todo: CRUD recetas, usuarios, aprobar pendientes, panel admin, sub-admins |
| **worker** (Mitarbeiter) | Sin password | Digitalizar, crear recetas (van a pendientes), comentar, editar propias, ajustar porciones |
| **guest** (Gast) | Sin password | Solo ver recetas, ver comentarios (no crear), buscar |

### Flujo de Auth
1. Landing page → Seleccion de rol
2. Admin: pide password → verifica contra BD (BCrypt)
3. Worker/Guest: acceso directo, se crea user en localStorage
4. Datos guardados: `recipe-auth`, `user-role`, `current-user` en localStorage
5. Sesion expira en 24 horas (cliente-side)
6. Token de sesion generado con `bin2hex(random_bytes(32))`

### Flujo de Recetas segun Rol
- **Admin crea receta** → Se inserta directamente en `recipes` con status `approved`
- **Worker crea receta** → Se inserta en `recetas_pendientes` → Admin aprueba → Se mueve a `recipes`
- **Guest** → No puede crear recetas

---

## 6. Estructura de Componentes y Pantallas

### Flujo de Navegacion

```
LandingPage
    └── LoginPage (seleccion de rol)
            └── AppWrapper
                    └── RecipeDigitizer (componente principal con state manager)
                            ├── HomeDashboard (home)
                            │     ├── → RecipeLibrary (digitalizar)
                            │     ├── → RecipeArchivePage (archivo)
                            │     ├── → UserPage (perfil worker)
                            │     ├── → ManualRecipeCreator (crear manual)
                            │     └── → AdminDashboard (/admin)
                            │
                            ├── RecipeLibrary (library)
                            │     ├── Foto con camara
                            │     ├── Subir imagen
                            │     └── Escanear documento
                            │     → Confirmacion → Analisis IA → RecipeAnalyzer
                            │
                            ├── RecipeAnalyzer (analyze)
                            │     ├── Hero image con titulo
                            │     ├── Ingredientes numerados
                            │     ├── Instrucciones
                            │     ├── Galeria de imagenes
                            │     ├── Botones: Porciones, Compartir, Descargar, Imprimir
                            │     ├── Editar/Eliminar (segun permisos)
                            │     ├── ServingsModal (ajuste porciones con IA)
                            │     └── RecipeComments (comentarios + likes)
                            │
                            ├── RecipeArchivePage (archive)
                            │     ├── Grid/List view de todas las recetas
                            │     ├── Busqueda, filtro por categoria
                            │     ├── Favoritos
                            │     └── Paginacion
                            │
                            ├── UserPage (users)
                            │     ├── Overview de mis recetas
                            │     ├── Crear receta manual
                            │     └── Historial
                            │
                            └── ManualRecipeCreator (manual-recipes)
                                  ├── Form: titulo, descripcion, ingredientes, preparacion
                                  ├── Imagen opcional
                                  └── Guardar (va a pendientes si worker)

/admin (ruta separada)
    └── AdminDashboard
            ├── Estadisticas (pendientes, usuarios, recetas, sub-admins)
            ├── RecipeManagement (gestion recetas)
            ├── UserManagement (gestion usuarios)
            ├── PendingRecipes (aprobar/rechazar)
            └── SubAdminManagement (sub-administradores)
```

### Componentes Principales

| Archivo | Descripcion |
|---------|-------------|
| `components/app-wrapper.tsx` | Wrapper principal: landing → login → app |
| `recipe-digitizer.tsx` | State manager principal, routing interno, camara, analisis |
| `components/home-dashboard.tsx` | Dashboard home con cards de navegacion |
| `components/recipe-library.tsx` | Pantalla de digitalizacion (foto/upload/scan) |
| `components/recipe-analyzer.tsx` | Vista de receta completa con acciones |
| `components/recipe-archive-page.tsx` | Archivo/biblioteca de recetas |
| `components/recipe-archive.tsx` | Grid/list de recetas |
| `components/recipe-comments.tsx` | Sistema de comentarios + likes |
| `components/servings-modal.tsx` | Modal ajuste porciones con IA |
| `components/manual-recipe-creator.tsx` | Formulario crear receta manual |
| `components/user-page.tsx` | Pagina de perfil worker |
| `components/settings-modal.tsx` | Modal de configuracion |
| `components/loading-overlay.tsx` | Overlay de carga con progreso |
| `components/history-modal.tsx` | Modal de historial |
| `components/login-page.tsx` | Pagina de login |
| `components/landing-page.tsx` | Landing page |
| `components/pwa-install-modal.tsx` | Modal instalacion PWA |
| `components/theme-provider.tsx` | Provider dark/light mode |
| `components/admin/admin-dashboard.tsx` | Dashboard admin |
| `components/admin/recipe-management.tsx` | Gestion recetas (admin) |
| `components/admin/user-management.tsx` | Gestion usuarios (admin) |
| `components/admin/pending-recipes.tsx` | Aprobacion recetas |
| `components/admin/sub-admin-management.tsx` | Gestion sub-admins |

### Componentes UI (ShadCN)
Directorio `components/ui/` - 40+ componentes base:
button, card, dialog, input, textarea, tabs, badge, select, dropdown-menu, sheet, toast, toaster, form, label, checkbox, switch, accordion, alert-dialog, avatar, calendar, carousel, collapsible, command, context-menu, drawer, hover-card, input-otp, menubar, navigation-menu, pagination, popover, progress, radio-group, resizable, scroll-area, separator, sidebar, skeleton, slider, sonner, table, toggle, toggle-group, tooltip, aspect-ratio, breadcrumb, chart

---

## 7. Tipos de Datos TypeScript

```typescript
// lib/services/types.ts
interface Recipe {
  id: number;
  recipeId?: string;
  image: string;
  analysis: string;            // Texto completo de la receta
  date: string;
  folderId?: string;
  title?: string;
  isFavorite?: boolean;
  servings?: number;
  originalServings?: number;
  additionalImages?: string[];
  status?: 'pending' | 'approved' | 'rejected';
  user_id?: string;
}

interface Comment {
  id: string;
  author: string;
  role: 'admin' | 'worker' | 'guest';
  content: string;
  likes: number;
  likedBy: string[];           // Array de user_ids
  timestamp: string;
  isEdited: boolean;
}

interface User {
  id: string;
  name: string;
  email?: string;
  role: 'admin' | 'worker' | 'guest';
  avatar?: string;
  active: boolean;
  lastActive?: string;
  recipesCreated?: number;
  permissions?: string[];
}

type UserRole = 'admin' | 'worker' | 'guest';

interface AuthState {
  isAuthenticated: boolean;
  role?: UserRole;
}

// types/index.ts
interface PendingRecipe {
  id: string;
  title: string;
  user: string;
  date: string;
  status: 'pending' | 'approved' | 'rejected';
}

interface SubAdmin {
  id: string;
  name: string;
  email: string;
  permissions: string[];
  createdDate: string;
  status: 'active' | 'inactive';
}

interface HistoryItem {
  id: number;
  recipeId?: string;
  image: string;
  analysis: string;
  date: string;
  folderId?: string;
  title?: string;
  isFavorite?: boolean;
  user_id?: string;
}
```

---

## 8. Capa de Servicios (Reutilizable)

La PWA tiene una capa de servicios que abstrae el acceso a datos. En Expo se puede reutilizar la logica:

### RecipeService (`lib/services/recipeService.ts`)
- `getAll()` → GET todas las recetas
- `getByUser(userId)` → GET recetas por usuario
- `getById(id)` → GET receta por ID
- `create(recipe)` → POST nueva receta
- `update(id, updates)` → PUT actualizar receta
- `delete(id)` → DELETE eliminar receta
- `search(query)` → Busqueda
- `getFavorites()` → Obtener favoritos
- `toggleFavorite(id)` → Toggle favorito
- `getPending()` → Recetas pendientes
- `approve(id)` / `reject(id)` → Aprobar/rechazar
- `saveAdditionalImages(id, images)` → Guardar imagenes extra
- `getAdditionalImages(id)` → Obtener imagenes extra
- `updateServings(id, servings, originalServings)` → Actualizar porciones

### AuthService (`lib/services/authService.ts`)
- `isAuthenticated()` → Verificar auth
- `getCurrentRole()` → Obtener rol
- `loginAsAdmin(password)` → Login admin (API o local)
- `loginAsRole(role)` → Login worker/guest
- `logout()` → Cerrar sesion
- `getAuthState()` → Estado completo
- `hasRole(role)` → Verificar rol
- `canPerform(action)` → Verificar permiso
- `refreshSession()` → Renovar sesion
- `isSessionValid()` → Validar sesion

### UserService (`lib/services/userService.ts`)
- CRUD de usuarios
- `getCurrentUser()` / `setCurrentUser()`
- Estadisticas

### CommentService (`lib/services/commentService.ts`)
- CRUD comentarios
- Toggle likes
- Busqueda por usuario

### API Config (`lib/services/api-config.ts`)
```typescript
const API_CONFIG = {
  USE_PRODUCTION: true,
  PRODUCTION: {
    BASE_URL: 'https://web.lweb.ch/recipedigitalizer/apis',
    ENDPOINTS: {
      LOGIN: '/auth-simple.php?action=login',
      RECIPES: '/recipes-simple.php',
      RECIPE_BY_ID: (id) => `/recipes-simple.php?id=${id}`,
      COMMENTS: (recipeId) => `/comments.php?recipe_id=${recipeId}`,
      COMMENT_BY_ID: (id) => `/comments.php?id=${id}`,
      USERS: '/users.php',
      USER_BY_ID: (id) => `/users.php?id=${id}`,
    }
  }
};
```

---

## 9. Server Actions (IA) - Necesitan Adaptacion

En Next.js estas son Server Actions (ejecutan en servidor para evitar CORS). En Expo hay que llamar directamente o crear un proxy.

### Analisis de Imagen con IA
```typescript
// POST https://foodscan-ai.com/responseImageAnalysis.php
{
  model: "gpt-4.1",
  messages: [
    {
      role: "system",
      content: `Extrahiere das Rezept exakt aus dem Bild... für ${servings} Personen...`
    },
    {
      role: "user",
      content: [{ type: "image_url", image_url: { url: "data:image/jpeg;base64,..." } }]
    }
  ],
  max_tokens: 1000
}
// Respuesta: { choices: [{ message: { content: "texto receta..." } }] }
```

### Recalculo de Porciones con IA
```typescript
// POST https://foodscan-ai.com/responseChat.php
{
  model: "gpt-4.1",
  messages: [
    {
      role: "system",
      content: "Berechne nur die Mengen des Rezepts neu..."
    },
    {
      role: "user",
      content: `Berechne die Mengen für ${newServings} Personen um (original für ${originalServings} Personen):\n\n${recipe}`
    }
  ],
  max_tokens: 1000
}
```

---

## 10. Almacenamiento Local (localStorage → AsyncStorage)

### Keys de localStorage usados en la PWA

| Key | Tipo | Descripcion |
|-----|------|-------------|
| `recipe-auth` | `'granted' \| null` | Estado autenticacion |
| `user-role` | `'admin' \| 'worker' \| 'guest'` | Rol del usuario |
| `current-user` | JSON `{id, name, role, ...}` | Usuario actual |
| `auth-session` | ISO timestamp | Timestamp sesion |
| `auth-token` | string | Token de sesion |
| `api-session-id` | string | Session ID para API |
| `has-seen-landing` | `'true'` | Flag landing page vista |
| `recipe-servings` | number string | Porciones actuales |
| `recipe-original-servings` | number string | Porciones originales |
| `recipeHistory` | JSON HistoryItem[] | Cache historial recetas |
| `recipe-images-{id}` | JSON string[] | Imagenes adicionales (cache) |
| `selectedRecipe` | JSON HistoryItem | Receta seleccionada (temp) |

**En Expo**: Reemplazar `localStorage` por `AsyncStorage` de `@react-native-async-storage/async-storage`.

---

## 11. Assets PWA

### Iconos (public/)
- `icon-72x72.png`, `icon-96x96.png`, `icon-128x128.png`
- `icon-144x144.png`, `icon-152x152.png`, `icon-192x192.png`
- `icon-384x384.png`, `icon-512x512.png`
- `apple-touch-icon.png`
- `favicon-16x16.png`, `favicon-32x32.png`
- `chef-hat-icon.svg`, `placeholder-logo.svg`, `placeholder-logo.png`
- `placeholder.jpg`, `placeholder.svg`, `placeholder-user.jpg`
- `install.png` (instrucciones instalacion PWA)

### Manifest PWA
```json
{
  "name": "Recipe Digitizer",
  "short_name": "RecipeApp",
  "display": "standalone",
  "background_color": "#ffffff",
  "theme_color": "#ffffff",
  "orientation": "portrait-primary",
  "categories": ["food", "utilities", "productivity"]
}
```

---

## 12. Funcionalidades a Replicar en Expo

### Criticas (Prioridad Alta)
1. **Autenticacion** - Login por roles (admin password, worker/guest directo)
2. **Camara nativa** - Capturar foto de receta (expo-camera)
3. **Seleccion de imagen** - Galeria (expo-image-picker)
4. **Analisis IA** - Enviar imagen base64 a FoodScan AI
5. **Vista de receta** - Renderizar receta analizada con formato
6. **Archivo de recetas** - Lista grid/list con busqueda y paginacion
7. **CRUD recetas** - Crear, editar, eliminar
8. **Sistema de permisos** - Diferentes capacidades por rol

### Importantes (Prioridad Media)
9. **Comentarios** - CRUD + likes + lista de who liked
10. **Favoritos** - Toggle + lista de favoritos
11. **Ajuste porciones** - Recalculo con IA
12. **Categorias** - Filtro por categoria
13. **Crear receta manual** - Formulario sin foto
14. **Panel admin** - Dashboard con estadisticas
15. **Gestion usuarios** - CRUD (admin)
16. **Aprobacion recetas** - Aprobar/rechazar pendientes

### Nice to Have (Prioridad Baja)
17. **Compartir** - Share nativo
18. **Imprimir** - Formato impresion
19. **Descargar imagen** - Guardar receta como imagen
20. **Scanner documentos** - Modo scanner optimizado
21. **Dark mode** - Tema oscuro
22. **Galeria imagenes** - Multiples fotos por receta
23. **Notificaciones** - Push para aprobaciones
24. **Offline mode** - Cache offline

---

## 13. Equivalencias Tecnologicas PWA → Expo

| PWA (Next.js) | Expo (React Native) |
|---------------|---------------------|
| Next.js App Router | Expo Router (file-based) |
| React DOM | React Native |
| Tailwind CSS | NativeWind o StyleSheet |
| ShadCN/UI + Radix | React Native Paper / Tamagui / custom |
| Framer Motion | React Native Reanimated |
| Lucide React | Lucide React Native o Expo Vector Icons |
| next/image | expo-image o Image de RN |
| localStorage | AsyncStorage |
| navigator.mediaDevices | expo-camera |
| input type="file" | expo-image-picker |
| navigator.share | expo-sharing |
| Service Worker | Sin equivalente (app nativa) |
| Server Actions (CORS) | Llamadas directas fetch (no hay CORS en nativo) |
| window.print() | expo-print |
| Canvas (download) | expo-media-library + ViewShot |
| next/navigation | expo-router |
| Recharts | react-native-chart-kit o Victory Native |
| react-hook-form | react-hook-form (funciona igual) |
| Zod | Zod (funciona igual) |

---

## 14. Estructura Sugerida Proyecto Expo

```
recipe-digitizer-expo/
├── app/                          # Expo Router
│   ├── _layout.tsx               # Root layout
│   ├── index.tsx                 # Landing page
│   ├── login.tsx                 # Login page
│   ├── (tabs)/                   # Tab navigation (autenticado)
│   │   ├── _layout.tsx           # Tab layout
│   │   ├── home.tsx              # Dashboard home
│   │   ├── digitize.tsx          # Digitalizar receta
│   │   ├── archive.tsx           # Archivo de recetas
│   │   └── profile.tsx           # Perfil / Mi pagina
│   ├── recipe/[id].tsx           # Vista de receta
│   ├── recipe/create.tsx         # Crear receta manual
│   └── admin/                    # Panel admin
│       ├── _layout.tsx
│       ├── index.tsx             # Dashboard admin
│       ├── users.tsx             # Gestion usuarios
│       ├── pending.tsx           # Recetas pendientes
│       └── recipes.tsx           # Gestion recetas
│
├── components/                   # Componentes reutilizables
│   ├── RecipeCard.tsx
│   ├── RecipeAnalyzer.tsx
│   ├── RecipeComments.tsx
│   ├── ServingsModal.tsx
│   ├── ImageGallery.tsx
│   ├── SearchBar.tsx
│   ├── LoadingOverlay.tsx
│   └── ui/                       # Componentes base
│       ├── Button.tsx
│       ├── Card.tsx
│       ├── Input.tsx
│       ├── Modal.tsx
│       └── ...
│
├── services/                     # Capa de servicios (reutilizar logica)
│   ├── api-config.ts             # Config API (copiar de PWA)
│   ├── recipeService.ts          # Servicio recetas
│   ├── authService.ts            # Servicio auth
│   ├── userService.ts            # Servicio usuarios
│   ├── commentService.ts         # Servicio comentarios
│   ├── aiService.ts              # Servicio IA (reemplaza server actions)
│   └── types.ts                  # Tipos compartidos
│
├── hooks/                        # Custom hooks
│   ├── useAuth.ts
│   ├── useRecipes.ts
│   └── useCamera.ts
│
├── store/                        # Estado global (Zustand o Context)
│   ├── authStore.ts
│   └── recipeStore.ts
│
├── constants/                    # Constantes
│   ├── colors.ts
│   ├── api.ts
│   └── roles.ts
│
├── assets/                       # Iconos, imagenes
│   └── images/
│
├── app.json                      # Config Expo
├── package.json
└── tsconfig.json
```

---

## 15. Consideraciones Importantes para la Migracion

### Lo que se puede reutilizar directamente
- **Toda la logica de servicios** (fetch calls, tipos, config API)
- **Tipos TypeScript** (types.ts, interfaces)
- **Logica de negocio** (permisos, flujos de datos, validaciones)
- **Llamadas a API** (fetch funciona igual en React Native)

### Lo que hay que reescribir
- **Todos los componentes UI** (JSX web → React Native components)
- **Estilos** (Tailwind CSS → StyleSheet / NativeWind)
- **Navegacion** (Next.js routes → Expo Router)
- **Camara** (navigator.mediaDevices → expo-camera)
- **Almacenamiento** (localStorage → AsyncStorage)
- **Server Actions** (ya no necesarios, fetch directo sin CORS)
- **Imagenes** (next/image → expo-image)
- **Print/Share** (APIs web → expo-print/expo-sharing)

### Ventajas de App Nativa sobre PWA
- Acceso a camara nativo (mejor calidad, mas control)
- Notificaciones push reales
- Almacenamiento local sin limite de 10MB
- Mejor performance
- Acceso a funciones del dispositivo
- Presencia en App Store / Google Play
- No dependencia de navegador

### Cosas que desaparecen
- Service Worker (no aplica)
- PWA install modal (no aplica)
- Vercel config (no aplica)
- SEO/meta tags (no aplica)

---

## 16. Dependencias Sugeridas para Expo

```json
{
  "dependencies": {
    "expo": "~52",
    "expo-router": "~4",
    "expo-camera": "~16",
    "expo-image-picker": "~16",
    "expo-image": "~2",
    "expo-sharing": "~13",
    "expo-print": "~14",
    "expo-media-library": "~17",
    "@react-native-async-storage/async-storage": "^2",
    "react-native-reanimated": "~3",
    "react-native-gesture-handler": "~2",
    "react-native-safe-area-context": "~5",
    "@expo/vector-icons": "^14",
    "react-hook-form": "^7",
    "zod": "^3",
    "zustand": "^5",
    "date-fns": "^4",
    "react-native-view-shot": "^4"
  }
}
```

---

## 17. Publicacion

### Para Apple App Store
- Requiere cuenta Apple Developer ($99/año)
- Build con EAS Build (`eas build --platform ios`)
- Submit con EAS Submit (`eas submit --platform ios`)
- Requiere review de Apple (~1-3 dias)

### Para Google Play Store
- Requiere cuenta Google Play Console ($25 unica vez)
- Build con EAS Build (`eas build --platform android`)
- Submit con EAS Submit (`eas submit --platform android`)
- Requiere review de Google (~1-2 dias)

### Desarrollo Local
```bash
npx create-expo-app recipe-digitizer-expo --template tabs
cd recipe-digitizer-expo
npx expo start
# Escanear QR con Expo Go en telefono
```

---

*Documento generado: Febrero 2026*
*Basado en analisis completo del proyecto recipe-digitizer-main*
