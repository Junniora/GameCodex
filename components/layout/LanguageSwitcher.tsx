'use client';
// components/layout/LanguageSwitcher.tsx
import { useAppStore } from '@/store/useAppStore';
import type { Language } from '@/types';
import { Globe } from 'lucide-react';

const languages = [
  { code: 'es' as Language, label: 'ES', icon: Globe },
  { code: 'en' as Language, label: 'EN', icon: Globe },
];

export default function LanguageSwitcher() {
  const { language, setLanguage } = useAppStore();

  return (
    <div className="flex items-center gap-0.5 p-0.5 rounded-lg bg-tertiary">
      {languages.map(({ code, label, icon: Icon }) => (
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
          <Icon className="w-3 h-3" />
          <span>{label}</span>
        </button>
      ))}
    </div>
  );
}
