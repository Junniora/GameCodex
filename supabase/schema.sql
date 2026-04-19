-- ============================================================
-- 🎮 GameHub — Schema SQL para Supabase
-- Ejecutar en el SQL Editor de tu proyecto Supabase
-- ============================================================

-- ─────────────────────────────────────────
-- TABLA: categories
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS categories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  name_en TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  icon TEXT,               -- emoji o nombre de icono
  description TEXT,
  description_en TEXT,
  color TEXT DEFAULT '#6366f1',
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- TABLA: games
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS games (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT NOT NULL UNIQUE,
  description TEXT,
  description_en TEXT,
  image_url TEXT,
  banner_url TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  platforms TEXT[] DEFAULT '{}',   -- ['PC', 'PS5', 'Xbox', 'Switch']
  release_year INT,
  developer TEXT,
  publisher TEXT,
  rating DECIMAL(3,1),
  purchase_links JSONB DEFAULT '[]',
  -- [{"platform": "Steam", "url": "https://...", "price": "$29.99"}]
  tags TEXT[] DEFAULT '{}',
  is_featured BOOLEAN DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- TABLA: game_wiki
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS game_wiki (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  section_title TEXT NOT NULL,
  section_title_en TEXT NOT NULL,
  content TEXT NOT NULL,
  content_en TEXT NOT NULL,
  content_type TEXT DEFAULT 'text',
  -- 'text' | 'table' | 'tips' | 'layers' | 'list'
  metadata JSONB DEFAULT '{}',
  -- Para tablas: {"headers": [...], "rows": [[...]]}
  -- Para capas Minecraft: {"layers": [{"y": "-64 a -58", "resource": "Diamante", "color": "#60d0f0"}]}
  display_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- TABLA: favorites
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS favorites (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  game_id UUID NOT NULL REFERENCES games(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  UNIQUE(user_id, game_id)
);

-- ─────────────────────────────────────────
-- TABLA: user_preferences
-- ─────────────────────────────────────────
CREATE TABLE IF NOT EXISTS user_preferences (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE UNIQUE,
  language TEXT DEFAULT 'es',  -- 'es' | 'en'
  theme TEXT DEFAULT 'dark',   -- 'dark' | 'light'
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- ─────────────────────────────────────────
-- ROW LEVEL SECURITY (RLS)
-- ─────────────────────────────────────────

-- Habilitar RLS
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE games ENABLE ROW LEVEL SECURITY;
ALTER TABLE game_wiki ENABLE ROW LEVEL SECURITY;
ALTER TABLE favorites ENABLE ROW LEVEL SECURITY;
ALTER TABLE user_preferences ENABLE ROW LEVEL SECURITY;

-- Policies: lectura pública para categories, games, wiki
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);
CREATE POLICY "Public read games" ON games FOR SELECT USING (true);
CREATE POLICY "Public read wiki" ON game_wiki FOR SELECT USING (true);

-- Policies: favorites solo del usuario autenticado
CREATE POLICY "Users manage own favorites" ON favorites
  FOR ALL USING (auth.uid() = user_id);

-- Policies: preferencias del usuario
CREATE POLICY "Users manage own preferences" ON user_preferences
  FOR ALL USING (auth.uid() = user_id);

-- Policies: solo admins pueden crear/editar categorías y juegos
-- (Para simplificar, permitimos a usuarios autenticados — ajusta según necesidad)
CREATE POLICY "Auth users insert categories" ON categories
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth users insert games" ON games
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth users insert wiki" ON game_wiki
  FOR INSERT WITH CHECK (auth.role() = 'authenticated');
CREATE POLICY "Auth users update games" ON games
  FOR UPDATE USING (auth.role() = 'authenticated');
CREATE POLICY "Auth users update wiki" ON game_wiki
  FOR UPDATE USING (auth.role() = 'authenticated');

-- ─────────────────────────────────────────
-- SEED DATA — Categorías de ejemplo
-- ─────────────────────────────────────────
INSERT INTO categories (name, name_en, slug, icon, description, description_en, color) VALUES
  ('Sandbox', 'Sandbox', 'sandbox', '🏗️', 'Mundos abiertos para construir y explorar', 'Open worlds to build and explore', '#f59e0b'),
  ('FPS', 'FPS', 'fps', '🎯', 'Disparos en primera persona', 'First-person shooters', '#ef4444'),
  ('RPG', 'RPG', 'rpg', '⚔️', 'Juegos de rol y aventura', 'Role-playing games and adventures', '#8b5cf6'),
  ('Estrategia', 'Strategy', 'strategy', '♟️', 'Planificación y táctica', 'Planning and tactics', '#06b6d4'),
  ('Aventura', 'Adventure', 'adventure', '🗺️', 'Exploración y narrativa', 'Exploration and narrative', '#10b981'),
  ('Deportes', 'Sports', 'sports', '⚽', 'Simuladores deportivos', 'Sports simulators', '#f97316');

-- ─────────────────────────────────────────
-- SEED DATA — Juegos de ejemplo
-- ─────────────────────────────────────────
INSERT INTO games (name, slug, description, description_en, image_url, category_id, platforms, release_year, developer, rating, purchase_links, is_featured) VALUES
(
  'Minecraft',
  'minecraft',
  'El juego sandbox más popular del mundo. Construye, explora y sobrevive en un mundo de bloques infinito.',
  'The world''s most popular sandbox game. Build, explore, and survive in an infinite world of blocks.',
  'https://upload.wikimedia.org/wikipedia/en/5/51/Minecraft_cover.png',
  (SELECT id FROM categories WHERE slug = 'sandbox'),
  ARRAY['PC', 'PS4', 'PS5', 'Xbox', 'Switch', 'Mobile'],
  2011,
  'Mojang Studios',
  9.5,
  '[{"platform": "Java (PC)", "url": "https://www.minecraft.net/es-es/store/minecraft-java-bedrock-edition-pc", "price": "$29.99"}, {"platform": "Bedrock", "url": "https://www.minecraft.net/", "price": "$6.99"}]',
  true
),
(
  'Counter-Strike 2',
  'counter-strike-2',
  'El shooter táctico competitivo definitivo. Estrategia, precisión y trabajo en equipo.',
  'The definitive competitive tactical shooter. Strategy, precision and teamwork.',
  'https://cdn.cloudflare.steamstatic.com/steam/apps/730/header.jpg',
  (SELECT id FROM categories WHERE slug = 'fps'),
  ARRAY['PC'],
  2023,
  'Valve',
  9.0,
  '[{"platform": "Steam", "url": "https://store.steampowered.com/app/730/", "price": "Gratis"}]',
  true
),
(
  'The Witcher 3',
  'witcher-3',
  'Una épica aventura RPG de mundo abierto con una narrativa sin igual y cientos de horas de contenido.',
  'An epic open-world RPG adventure with unparalleled narrative and hundreds of hours of content.',
  'https://cdn.cloudflare.steamstatic.com/steam/apps/292030/header.jpg',
  (SELECT id FROM categories WHERE slug = 'rpg'),
  ARRAY['PC', 'PS4', 'PS5', 'Xbox', 'Switch'],
  2015,
  'CD Projekt Red',
  9.8,
  '[{"platform": "Steam", "url": "https://store.steampowered.com/app/292030/", "price": "$39.99"}, {"platform": "GOG", "url": "https://www.gog.com/game/the_witcher_3_wild_hunt", "price": "$39.99"}]',
  true
);

-- ─────────────────────────────────────────
-- SEED DATA — Wiki de Minecraft
-- ─────────────────────────────────────────
INSERT INTO game_wiki (game_id, section_title, section_title_en, content, content_en, content_type, metadata, display_order) VALUES
(
  (SELECT id FROM games WHERE slug = 'minecraft'),
  'Capas de recursos',
  'Resource layers',
  'Los minerales en Minecraft se generan en capas específicas del mundo. Usa coordenadas Y para encontrarlos.',
  'Minerals in Minecraft generate at specific world layers. Use Y coordinates to find them.',
  'layers',
  '{
    "layers": [
      {"y": "Y: -64 a -58", "resource": "Diamante", "resource_en": "Diamond", "color": "#60d0f0", "tip": "Mejor en Y: -58"},
      {"y": "Y: -64 a -58", "resource": "Esmeralda", "resource_en": "Emerald", "color": "#50c878", "tip": "Solo en montañas"},
      {"y": "Y: -64 a 16", "resource": "Oro", "resource_en": "Gold", "color": "#ffd700", "tip": "Mejor en Y: -16"},
      {"y": "Y: -64 a 320", "resource": "Hierro", "resource_en": "Iron", "color": "#c0a080", "tip": "Mejor en Y: 16 y 232"},
      {"y": "Y: -64 a 16", "resource": "Redstone", "resource_en": "Redstone", "color": "#ff4444", "tip": "Mejor en Y: -62"},
      {"y": "Y: 0 a 16", "resource": "Lapislázuli", "resource_en": "Lapis Lazuli", "color": "#4169e1", "tip": "Mejor en Y: 0"}
    ]
  }',
  1
),
(
  (SELECT id FROM games WHERE slug = 'minecraft'),
  'Consejos para sobrevivir',
  'Survival tips',
  'Consejos esenciales para tu primera noche y aventuras posteriores en Minecraft.',
  'Essential tips for your first night and subsequent adventures in Minecraft.',
  'tips',
  '{
    "tips": [
      {"icon": "🪵", "tip": "Recolecta madera inmediatamente al iniciar el mundo", "tip_en": "Collect wood immediately when starting the world"},
      {"icon": "🏠", "tip": "Construye un refugio antes del primer anochecer (10 minutos)", "tip_en": "Build a shelter before the first nightfall (10 minutes)"},
      {"icon": "🍖", "tip": "Nunca te quedes sin comida — mantén al menos 5 piezas", "tip_en": "Never run out of food — keep at least 5 pieces"},
      {"icon": "💡", "tip": "Ilumina tu base para evitar spawns de mobs hostiles", "tip_en": "Light up your base to prevent hostile mob spawns"},
      {"icon": "⛏️", "tip": "Nunca caves directamente hacia abajo — riesgo de caer a lava", "tip_en": "Never dig straight down — risk of falling into lava"},
      {"icon": "🛏️", "tip": "Duerme cada noche para evitar la aparición de Fantasmas", "tip_en": "Sleep every night to avoid Phantom spawning"}
    ]
  }',
  2
),
(
  (SELECT id FROM games WHERE slug = 'minecraft'),
  'El Nether',
  'The Nether',
  'Dimensión peligrosa con recursos únicos y accesos a lugares lejanos del mundo principal.',
  'Dangerous dimension with unique resources and shortcuts to distant places in the main world.',
  'table',
  '{
    "headers": ["Mob/Estructura", "Recurso", "Utilidad"],
    "headers_en": ["Mob/Structure", "Resource", "Use"],
    "rows": [
      ["Fortaleza del Nether", "Varillas de Blaze", "Pociones de fuerza, Ojos del Fin"],
      ["Bastión remanente", "Lingotes de Netherite", "La mejor armadura del juego"],
      ["Blaze", "Polvo de Blaze", "Pociones, Ojos del Fin"],
      ["Piglin", "Oro", "Trueque: pirite, obsidiana, flechas"]
    ]
  }',
  3
);
