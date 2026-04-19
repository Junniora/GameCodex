// types/index.ts

export interface Category {
  id: string;
  name: string;
  name_en: string;
  slug: string;
  icon?: string;
  description?: string;
  description_en?: string;
  color: string;
  created_at: string;
}

export interface PurchaseLink {
  platform: string;
  url: string;
  price: string;
}

export interface Game {
  id: string;
  name: string;
  slug: string;
  description?: string;
  description_en?: string;
  image_url?: string;
  banner_url?: string;
  category_id?: string;
  categories?: Category;
  platforms: string[];
  release_year?: number;
  developer?: string;
  publisher?: string;
  rating?: number;
  purchase_links: PurchaseLink[];
  tags: string[];
  is_featured: boolean;
  created_at: string;
  updated_at: string;
}

export type WikiContentType = 'text' | 'table' | 'tips' | 'layers' | 'list';

export interface LayerItem {
  y: string;
  resource: string;
  resource_en: string;
  color: string;
  tip?: string;
}

export interface TipItem {
  icon: string;
  tip: string;
  tip_en: string;
}

export interface TableMetadata {
  headers: string[];
  headers_en: string[];
  rows: string[][];
}

export interface LayersMetadata {
  layers: LayerItem[];
}

export interface TipsMetadata {
  tips: TipItem[];
}

export interface WikiSection {
  id: string;
  game_id: string;
  section_title: string;
  section_title_en: string;
  content: string;
  content_en: string;
  content_type: WikiContentType;
  metadata: TableMetadata | LayersMetadata | TipsMetadata | Record<string, unknown>;
  display_order: number;
  created_at: string;
}

export interface Favorite {
  id: string;
  user_id: string;
  game_id: string;
  created_at: string;
  games?: Game;
}

export interface UserPreferences {
  id: string;
  user_id: string;
  language: 'es' | 'en';
  theme: 'dark' | 'light';
}

export type Language = 'es' | 'en';

export interface AppUser {
  id: string;
  email?: string;
  preferences?: UserPreferences;
}
