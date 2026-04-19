'use client';
// components/layout/LanguageSwitcher.tsx
import { useAppStore } from '@/store/useAppStore';
import type { Language } from '@/types';

const languages = [
  { code: 'es' as Language, label: 'ES', flag: '🇲🇽' },
  { code: 'en' as Language, label: 'EN', flag: '🇺🇸' },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useAppStore();

  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-tertiary">
      {languages.map(({ code, label, flag }) => (
        <button
          key={code}
          onClick={() => setLanguage(code)}
          className={`
            flex items-center gap-1 px-2 py-1 rounded-md text-xs font-semibold
            transition-all duration-200
            ${language === code
              ? 'bg-primary text-primary shadow-sm'
              : 'text-muted hover:text-primary'
            }
          `}
          title={`Switch to ${label}`}
        >
          <span>{flag}</span>
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
