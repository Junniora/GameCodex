'use client';
// app/(hub)/games/page.tsx
import { useState } from 'react';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/lib/hooks/useAuth';
import { useGames, useCategories } from '@/lib/hooks/useGames';
import { useFavorites } from '@/lib/hooks/useFavorites';
import GameCard from '@/components/hub/GameCard';
import CategoryFilter from '@/components/hub/CategoryFilter';
import SearchBar from '@/components/hub/SearchBar';

export default function GamesPage() {
  const { t, language } = useAppStore();
  const { user } = useAuth();
  const { categories } = useCategories();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [search, setSearch] = useState('');
  const { games, loading } = useGames(
    selectedCategory === 'all' ? undefined : selectedCategory,
    search || undefined
  );
  const { isFavorite, toggleFavorite } = useFavorites(user?.id);

  return (
    <div className="max-w-7xl mx-auto px-4 space-y-6 animate-fadeIn">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-extrabold flex items-center gap-2">
            🎮 {t('hub.allGames')}
          </h1>
          <p className="text-sm text-muted mt-1">
            {loading ? '...' : `${games.length} juegos`}
          </p>
        </div>
        <SearchBar
          value={search}
          onChange={setSearch}
          placeholder={t('hub.searchPlaceholder')}
        />
      </div>

      {/* Filters */}
      <CategoryFilter
        categories={categories}
        selected={selectedCategory}
        onSelect={setSelectedCategory}
        language={language}
        allLabel={t('hub.allCategories')}
      />

      {/* Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {loading
          ? Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="skeleton h-52 rounded-2xl" />
            ))
          : games.length === 0
          ? (
              <div className="col-span-full text-center py-24">
                <div className="text-5xl mb-4">🔍</div>
                <p className="font-semibold text-lg">{t('hub.noResults')}</p>
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
                animationDelay={i * 40}
              />
            ))
        }
      </div>
    </div>
  );
}
