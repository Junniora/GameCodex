// store/useAppStore.ts
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { Language } from '@/types';
import { getTranslations, type Translations } from '@/lib/i18n/config';

interface AppState {
  language: Language;
  theme: 'dark' | 'light';
  translations: Translations;
  setLanguage: (lang: Language) => void;
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
  t: (key: string) => string;
}

export const useAppStore = create<AppState>()(
  persist(
    (set, get) => ({
      language: 'es',
      theme: 'dark',
      translations: getTranslations('es'),

      setLanguage: (lang: Language) => {
        const translations = getTranslations(lang);
        set({ language: lang, translations });
      },

      setTheme: (theme) => {
        set({ theme });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', theme === 'dark');
        }
      },

      toggleTheme: () => {
        const { theme } = get();
        const newTheme = theme === 'dark' ? 'light' : 'dark';
        set({ theme: newTheme });
        if (typeof document !== 'undefined') {
          document.documentElement.classList.toggle('dark', newTheme === 'dark');
        }
      },

      t: (key: string) => {
        const { translations } = get();
        const keys = key.split('.');
        let value: unknown = translations;
        for (const k of keys) {
          if (value && typeof value === 'object') {
            value = (value as Record<string, unknown>)[k];
          } else return key;
        }
        return typeof value === 'string' ? value : key;
      },
    }),
    {
      name: 'gamehub-preferences',
      partialize: (state) => ({
        language: state.language,
        theme: state.theme,
      }),
    }
  )
);
