# 🎮 GameHub — Estructura del Proyecto

```
gameHub/
├── app/
│   ├── (auth)/
│   │   ├── login/page.tsx
│   │   └── register/page.tsx
│   ├── (hub)/
│   │   ├── layout.tsx
│   │   ├── hub/page.tsx
│   │   ├── games/page.tsx
│   │   ├── games/[id]/page.tsx
│   │   ├── wiki/[gameId]/page.tsx
│   │   └── favorites/page.tsx
│   ├── admin/
│   │   └── page.tsx
│   ├── globals.css
│   ├── layout.tsx
│   └── page.tsx
├── components/
│   ├── auth/
│   │   ├── LoginForm.tsx
│   │   └── RegisterForm.tsx
│   ├── hub/
│   │   ├── GameCard.tsx
│   │   ├── CategoryFilter.tsx
│   │   ├── SearchBar.tsx
│   │   └── FavoriteButton.tsx
│   ├── layout/
│   │   ├── Navbar.tsx
│   │   ├── Sidebar.tsx
│   │   └── LanguageSwitcher.tsx
│   └── ui/
│       ├── GlassCard.tsx
│       ├── Button.tsx
│       └── Modal.tsx
├── lib/
│   ├── supabase/
│   │   ├── client.ts
│   │   ├── server.ts
│   │   └── middleware.ts
│   ├── i18n/
│   │   ├── locales/
│   │   │   ├── es.json
│   │   │   └── en.json
│   │   └── config.ts
│   └── hooks/
│       ├── useAuth.ts
│       ├── useGames.ts
│       ├── useFavorites.ts
│       └── useLanguage.ts
├── store/
│   └── useAppStore.ts
├── types/
│   └── index.ts
├── middleware.ts
├── next.config.js
├── tailwind.config.ts
└── .env.local
```
