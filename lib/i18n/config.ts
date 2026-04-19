// lib/i18n/config.ts
import es from './locales/es.json';
import en from './locales/en.json';
import type { Language } from '@/types';

export const locales = { es, en };

type DeepPartial<T> = { [K in keyof T]?: T[K] extends object ? DeepPartial<T[K]> : T[K] };
export type Translations = typeof es;

export function getTranslations(lang: Language): Translations {
  return locales[lang] ?? locales.es;
}

// Función helper para acceder a claves anidadas con dot notation
export function t(translations: Translations, key: string): string {
  const keys = key.split('.');
  let value: unknown = translations;
  for (const k of keys) {
    if (value && typeof value === 'object') {
      value = (value as Record<string, unknown>)[k];
    } else {
      return key;
    }
  }
  return typeof value === 'string' ? value : key;
}
