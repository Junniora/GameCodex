'use client';
// components/hub/GameCard.tsx
import Link from 'next/link';
import Image from 'next/image';
import type { Game } from '@/types';
import type { Language } from '@/types';
import FavoriteButton from './FavoriteButton';
import { useAppStore } from '@/store/useAppStore';

interface Props {
  game: Game;
  language: Language;
  isFavorite: boolean;
  onToggleFavorite: () => void;
  animationDelay?: number;
  featured?: boolean;
}

export default function GameCard({
  game,
  language,
  isFavorite,
  onToggleFavorite,
  animationDelay = 0,
  featured = false,
}: Props) {
  const { t } = useAppStore();
  const desc = language === 'en' ? game.description_en : game.description;

  return (
    <div
      className="glass rounded-2xl overflow-hidden card-hover group animate-fadeIn"
      style={{
        animationDelay: `${animationDelay}ms`,
        animationFillMode: 'both',
        opacity: 0,
      }}
    >
      {/* Image */}
      <div className={`relative overflow-hidden ${featured ? 'h-40' : 'h-32'} bg-secondary`}>
        {game.image_url ? (
          <img
            src={game.image_url}
            alt={game.name}
            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-4xl">
            🎮
          </div>
        )}
        {/* Category badge */}
        {game.categories && (
          <div
            className="absolute top-2 left-2 px-2 py-0.5 rounded-full text-xs font-semibold text-white"
            style={{ backgroundColor: game.categories.color + 'cc' }}
          >
            {game.categories.icon} {language === 'en' ? game.categories.name_en : game.categories.name}
          </div>
        )}
        {/* Favorite button */}
        <div className="absolute top-2 right-2">
          <FavoriteButton isFavorite={isFavorite} onToggle={onToggleFavorite} />
        </div>
      </div>

      {/* Content */}
      <div className="p-4">
        <h3 className="font-bold text-sm mb-1 line-clamp-1">{game.name}</h3>
        {desc && (
          <p className="text-xs text-muted line-clamp-2 mb-3">{desc}</p>
        )}

        {/* Platforms */}
        {game.platforms?.length > 0 && (
          <div className="flex flex-wrap gap-1 mb-3">
            {game.platforms.slice(0, 3).map((p) => (
              <span
                key={p}
                className="px-1.5 py-0.5 rounded-md bg-tertiary text-xs text-muted"
              >
                {p}
              </span>
            ))}
            {game.platforms.length > 3 && (
              <span className="px-1.5 py-0.5 rounded-md bg-tertiary text-xs text-muted">
                +{game.platforms.length - 3}
              </span>
            )}
          </div>
        )}

        {/* Rating + link */}
        <div className="flex items-center justify-between">
          {game.rating && (
            <div className="flex items-center gap-1 text-xs text-yellow-400">
              <span>⭐</span>
              <span className="font-semibold">{game.rating}</span>
            </div>
          )}
          <Link
            href={`/games/${game.slug}`}
            className="ml-auto text-xs font-semibold text-blue-400 hover:underline"
          >
            {t('games.viewDetails')} →
          </Link>
        </div>
      </div>
    </div>
  );
}
