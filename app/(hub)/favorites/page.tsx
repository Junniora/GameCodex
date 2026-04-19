'use client';
// app/(hub)/favorites/page.tsx
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/lib/hooks/useAuth';
import { useFavorites } from '@/lib/hooks/useFavorites';
import GameCard from '@/components/hub/GameCard';

export default function FavoritesPage() {
  const { t, language } = useAppStore();
  const { user } = useAuth();
  const { favoriteGames, loading, isFavorite, toggleFavorite } = useFavorites(user?.id);

  return (
    <div className="max-w-7xl mx-auto px-4">
      {/* Header */}
      <div className="mb-8 animate-fadeIn">
        <h1 className="text-3xl font-extrabold flex items-center gap-3 mb-1">
          <span>⭐</span> {t('favorites.title')}
        </h1>
        <p className="text-muted">{t('favorites.subtitle')}</p>
      </div>

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="skeleton h-48 rounded-2xl" />
          ))}
        </div>
      ) : favoriteGames.length === 0 ? (
        <div className="glass rounded-3xl p-16 text-center animate-scaleIn">
          <div className="text-6xl mb-4">⭐</div>
          <h2 className="text-xl font-bold mb-2">{t('favorites.empty')}</h2>
          <p className="text-muted mb-6">{t('favorites.emptyDesc')}</p>
          <Link href="/hub" className="btn-primary inline-block">
            {t('favorites.explorGames')}
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {favoriteGames.map((game, i) => (
            <GameCard
              key={game.id}
              game={game}
              language={language}
              isFavorite={isFavorite(game.id)}
              onToggleFavorite={() => toggleFavorite(game.id)}
              animationDelay={i * 60}
            />
          ))}
        </div>
      )}
    </div>
  );
}
