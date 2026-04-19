'use client';
// components/hub/CategoryFilter.tsx
import type { Category, Language } from '@/types';

interface Props {
  categories: Category[];
  selected: string;
  onSelect: (slug: string) => void;
  language: Language;
  allLabel: string;
}

export default function CategoryFilter({ categories, selected, onSelect, language, allLabel }: Props) {
  return (
    <div className="flex flex-wrap gap-2">
      <button
        onClick={() => onSelect('all')}
        className={`px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
          selected === 'all'
            ? 'bg-blue-500 text-white'
            : 'bg-tertiary text-muted hover:text-primary'
        }`}
      >
        {allLabel}
      </button>
      {categories.map((cat) => (
        <button
          key={cat.id}
          onClick={() => onSelect(cat.slug)}
          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-xs font-semibold transition-all duration-200 ${
            selected === cat.slug
              ? 'text-white'
              : 'bg-tertiary text-muted hover:text-primary'
          }`}
          style={selected === cat.slug ? { backgroundColor: cat.color } : {}}
        >
          {cat.icon} {language === 'en' ? cat.name_en : cat.name}
        </button>
      ))}
    </div>
  );
}
