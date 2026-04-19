# 🎮 GameHub — Hub de Videojuegos

Aplicación web full-stack con Next.js 15, Supabase, Tailwind CSS y soporte ES/EN.  
Diseño Apple-inspired con glassmorphism, dark mode y animaciones.

---

## ✨ Características

| Feature | Detalles |
|---|---|
| **Auth** | Login/Registro con Supabase Auth, sesiones persistentes |
| **Hub** | Explorador de juegos con filtros por categoría y búsqueda |
| **Wiki** | Secciones dinámicas: tablas, capas, consejos, texto |
| **Favoritos** | Lista personal por usuario |
| **Admin** | CRUD: crear categorías, juegos y secciones wiki |
| **i18n** | Español / Inglés — sin recarga, guardado en localStorage |
| **Dark Mode** | Toggle instantáneo, preferencia guardada |
| **Responsive** | Mobile-first, navbar adaptativa |

---

## 🚀 Setup rápido (5 pasos)

### 1. Clonar e instalar

```bash
git clone <tu-repo>
cd gamehub
npm install
```

### 2. Crear proyecto en Supabase

1. Ve a [supabase.com](https://supabase.com) → **New project**
2. Elige nombre, contraseña y región (ej: `us-east-1`)
3. Espera ~2 minutos a que el proyecto se inicialice

### 3. Ejecutar el schema SQL

1. En tu proyecto Supabase → **SQL Editor** → **New query**
2. Pega el contenido de `supabase/schema.sql`
3. Haz clic en **Run** — esto crea tablas, RLS y datos de ejemplo

### 4. Configurar variables de entorno

```bash
cp .env.example .env.local
```

Edita `.env.local` con tus credenciales:
- Ve a Supabase → **Settings** → **API**
- Copia `Project URL` → `NEXT_PUBLIC_SUPABASE_URL`
- Copia `anon public` key → `NEXT_PUBLIC_SUPABASE_ANON_KEY`

```env
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGci...
```

### 5. Correr en desarrollo

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) → redirige automáticamente al login.

---

## 📁 Estructura del proyecto

```
gamehub/
├── app/
│   ├── (auth)/login/          # Página de login
│   ├── (auth)/register/       # Página de registro
│   ├── (hub)/layout.tsx       # Layout con Navbar
│   ├── (hub)/hub/             # Hub principal
│   ├── (hub)/games/[slug]/    # Detalle de juego
│   ├── (hub)/wiki/[gameSlug]/ # Wiki del juego
│   ├── (hub)/favorites/       # Favoritos del usuario
│   ├── (hub)/admin/           # Panel CRUD
│   └── globals.css            # Estilos globales + tokens
├── components/
│   ├── hub/                   # GameCard, SearchBar, etc.
│   └── layout/                # Navbar, LanguageSwitcher
├── lib/
│   ├── supabase/              # Clientes browser/server
│   ├── i18n/locales/          # es.json / en.json
│   └── hooks/                 # useAuth, useGames, useFavorites
├── store/useAppStore.ts        # Estado global con Zustand
├── types/index.ts             # TypeScript types
├── middleware.ts               # Protección de rutas
└── supabase/schema.sql        # Schema + seed data
```

---

## 🗄️ Modelo de datos

```
auth.users (Supabase Auth)
    │
    ├── favorites (user_id → game_id)
    └── user_preferences (language, theme)

categories
    └── games (category_id)
            └── game_wiki (game_id)
```

### Tablas principales

| Tabla | Descripción |
|---|---|
| `categories` | Sandbox, FPS, RPG, etc. con nombre ES/EN |
| `games` | Juego con imagen, plataformas, links de compra |
| `game_wiki` | Secciones de wiki con metadata JSON flexible |
| `favorites` | Relación usuario ↔ juego |
| `user_preferences` | Idioma y tema por usuario |

---

## 🌐 Sistema de idioma

- Traducciones en `lib/i18n/locales/es.json` y `en.json`
- Store Zustand persiste en `localStorage` vía `zustand/middleware/persist`
- Cambio instantáneo sin recarga de página
- Contenido de DB bilingüe: campos `name` / `name_en`, `description` / `description_en`

```tsx
// Uso en cualquier componente:
const { t, language } = useAppStore();
t('hub.title')  // → "Tu Hub de Juegos" / "Your Games Hub"
```

---

## 🔐 Autenticación

Flujo completo con Supabase Auth + SSR:
- `middleware.ts` protege rutas `/hub`, `/games`, `/wiki`, `/favorites`, `/admin`
- Usuarios no autenticados → redirect a `/login`
- Usuarios autenticados en `/login` → redirect a `/hub`
- Sesión persistida en cookies HttpOnly

---

## 🎨 Sistema de diseño

Variables CSS en `globals.css`:

| Variable | Uso |
|---|---|
| `--bg-primary/secondary/tertiary` | Fondos en capas |
| `--text-primary/secondary/tertiary` | Texto por jerarquía |
| `--glass-bg` / `--glass-border` | Glassmorphism |
| `--accent` | Color de acción (azul Apple) |

Clases utilitarias:
- `.glass` — Efecto cristal con `backdrop-filter`
- `.btn-primary` / `.btn-secondary` — Botones Apple
- `.input-apple` — Inputs estilo iOS
- `.card-hover` — Hover con elevación suave
- `.skeleton` — Loading placeholders animados
- `.text-gradient` — Gradiente azul-violeta

---

## ➕ Agregar contenido

### Nueva categoría (UI Admin)
1. Ve a `/admin` → pestaña "Nueva Categoría"
2. Rellena nombre ES/EN, slug, icono emoji y color
3. Guarda

### Nuevo juego (UI Admin)
1. Ve a `/admin` → pestaña "Nuevo Juego"
2. Selecciona categoría, agrega imagen URL, plataformas (separadas por coma)
3. Para `purchase_links` usa formato JSON:
```json
[{"platform": "Steam", "url": "https://...", "price": "$29.99"}]
```

### Wiki entry (UI Admin)
1. Ve a `/admin` → pestaña "Agregar Wiki"
2. Pega el UUID del juego (cópialo desde Supabase Table Editor)
3. Elige `content_type`: `text`, `tips`, `layers`, `table`
4. Para `layers` (tipo Minecraft), el metadata debe ser:
```json
{
  "layers": [
    {"y": "Y: -64 a -58", "resource": "Diamante", "resource_en": "Diamond", "color": "#60d0f0"}
  ]
}
```

---

## 🌐 Deploy en Vercel

### Opción 1 — Vercel CLI

```bash
npm install -g vercel
vercel
```

### Opción 2 — GitHub + Vercel Dashboard

1. Sube tu repo a GitHub
2. Ve a [vercel.com](https://vercel.com) → **New Project** → importa tu repo
3. En **Environment Variables** agrega:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
4. Haz clic en **Deploy**

### Configurar dominio en Supabase

Una vez desplegado, en Supabase → **Authentication** → **URL Configuration**:
- **Site URL**: `https://tu-proyecto.vercel.app`
- **Redirect URLs**: `https://tu-proyecto.vercel.app/**`

---

## 🛠️ Scripts

```bash
npm run dev      # Desarrollo en localhost:3000
npm run build    # Build de producción
npm run start    # Servidor de producción
npm run lint     # Linting
```

---

## 📦 Dependencias clave

| Paquete | Versión | Uso |
|---|---|---|
| `next` | 15.1 | Framework full-stack |
| `@supabase/supabase-js` | 2.x | DB + Auth client |
| `@supabase/ssr` | 0.5 | Auth SSR/cookies |
| `zustand` | 5.x | Estado global + persistencia |
| `tailwindcss` | 4.x | Estilos utility-first |

---

## 🔄 Próximos pasos recomendados

- [ ] Agregar Framer Motion para animaciones más elaboradas
- [ ] Sistema de reviews/puntuaciones por usuario
- [ ] Subida de imágenes con Supabase Storage
- [ ] Roles de admin (tabla `user_roles`)
- [ ] Paginación en la lista de juegos
- [ ] PWA con `next-pwa`
- [ ] Modo offline con Service Worker

---

Hecho con ❤️ usando Next.js 15 + Supabase + Tailwind CSS
