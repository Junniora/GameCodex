'use client';
// app/(hub)/hub/page.tsx
import { useState } from 'react';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFeaturedGames, useCategories, useGames } from '@/lib/hooks/useGames';
import { useFavorites } from '@/lib/hooks/useFavorites';
import GameCard from '@/components/hub/GameCard';
import CategoryFilter from '@/components/hub/CategoryFilter';
import SearchBar from '@/components/hub/SearchBar';

export default function HubPage() {
  const { t, language } = useAppStore();
  const { user } = useAuth();
  const { games: featured, loading: featuredLoading } = useFeaturedGames();
  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const { games, loading } = useGames(
    selectedCategory === 'all' ? undefined : selectedCategory,
    search || undefined
  );
  const { isFavorite, toggleFavorite } = useFavorites(user?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-12">

      {/* Hero */}
      <section className="text-center py-10 animate-fadeIn" style={{ animationFillMode: 'both' }}>
        <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-3">
          {t('hub.title')}
        </h1>
        <p className="text-lg text-muted max-w-xl mx-auto">
          {t('hub.subtitle')}
        </p>
      </section>

      {/* Featured */}
      {!search && selectedCategory === 'all' && (
        <section className="animate-fadeIn delay-100" style={{ animationFillMode: 'both' }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>✨</span> {t('hub.featured')}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {featuredLoading
              ? Array.from({ length: 3 }).map((_, i) => (
                  <div key={i} className="skeleton h-56 rounded-2xl" />
                ))
              : featured.map((game, i) => (
                  <GameCard
                    key={game.id}
                    game={game}
                    language={language}
                    isFavorite={isFavorite(game.id)}
                    onToggleFavorite={() => toggleFavorite(game.id)}
                    animationDelay={i * 100}
                    featured
                  />
                ))
            }
          </div>
        </section>
      )}

      {/* Categories */}
      {!search && (
        <section className="animate-fadeIn delay-200" style={{ animationFillMode: 'both' }}>
          <h2 className="text-xl font-bold mb-4 flex items-center gap-2">
            <span>🗂️</span> {t('hub.categories')}
          </h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(
                  selectedCategory === cat.slug ? 'all' : cat.slug
                )}
                className={`
                  glass rounded-2xl p-4 text-center card-hover transition-all
                  ${selectedCategory === cat.slug ? 'ring-2 ring-blue-400' : ''}
                `}
              >
                <div className="text-3xl mb-1">{cat.icon}</div>
                <div className="text-xs font-semibold">
                  {language === 'en' ? cat.name_en : cat.name}
                </div>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Search + All games */}
      <section className="animate-fadeIn delay-300" style={{ animationFillMode: 'both' }}>
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <h2 className="text-xl font-bold flex items-center gap-2">
            <span>🎮</span> {t('hub.allGames')}
          </h2>
          <SearchBar
            value={search}
            onChange={setSearch}
            placeholder={t('hub.searchPlaceholder')}
          />
        </div>

        {/* Category filter pills */}
        <CategoryFilter
          categories={categories}
          selected={selectedCategory}
          onSelect={setSelectedCategory}
          language={language}
          allLabel={t('hub.allCategories')}
        />

        <div className="mt-5 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => (
                <div key={i} className="skeleton h-48 rounded-2xl" />
              ))
            : games.length === 0
            ? (
                <div className="col-span-full text-center py-16">
                  <div className="text-4xl mb-3">🔍</div>
                  <p className="font-semibold">{t('hub.noResults')}</p>
                  <p className="text-sm text-muted mt-1">{t('hub.noResultsDesc')}</p>
                </div>
              )
            : games.map((game, i) => (
                <GameCard
                  key={game.id}
                  game={game}
                  language={language}
                  isFavorite={isFavorite(game.id)}
                  onToggleFavorite={() => toggleFavorite(game.id)}
                  animationDelay={i * 50}
                />
              ))
          }
        </div>
      </section>
    </div>
  );
}
