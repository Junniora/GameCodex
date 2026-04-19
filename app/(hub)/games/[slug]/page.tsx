'use client';
// app/(hub)/games/[slug]/page.tsx
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { useAppStore } from '@/store/useAppStore';
import { useAuth } from '@/lib/hooks/useAuth';
import { useGame } from '@/lib/hooks/useGames';
import { useFavorites } from '@/lib/hooks/useFavorites';
import FavoriteButton from '@/components/hub/FavoriteButton';

export default function GameDetailPage() {
  const { slug } = useParams<{ slug: string }>();
  const { t, language } = useAppStore();
  const { user } = useAuth();
  const { game, loading } = useGame(slug);
  const { isFavorite, toggleFavorite } = useFavorites(user?.id);

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 space-y-4">
        <div className="skeleton h-64 rounded-2xl" />
        <div className="skeleton h-8 w-48 rounded-xl" />
        <div className="skeleton h-24 rounded-xl" />
      </div>
    );
  }

  if (!game) {
    return (
      <div className="max-w-4xl mx-auto px-4 text-center py-24">
        <div className="text-5xl mb-4">😕</div>
        <h2 className="text-xl font-bold">Game not found</h2>
        <Link href="/hub" className="btn-primary inline-block mt-4">
          ← {t('common.back')}
        </Link>
      </div>
    );
  }

  const desc = language === 'en' ? game.description_en : game.description;

  return (
    <div className="max-w-4xl mx-auto px-4 space-y-6 animate-fadeIn">
      {/* Back */}
      <Link href="/hub" className="inline-flex items-center gap-2 text-sm text-muted hover:text-primary transition-colors">
        ← {t('common.back')}
      </Link>

      {/* Banner / Hero */}
      <div className="relative rounded-3xl overflow-hidden h-56 md:h-72 bg-secondary">
        {game.image_url && (
          <img src={game.image_url} alt={game.name} className="w-full h-full object-cover" />
        )}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        {/* Info overlay */}
        <div className="absolute bottom-0 left-0 right-0 p-6">
          <div className="flex items-end justify-between gap-4">
            <div>
              {game.categories && (
                <div
                  className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-semibold text-white mb-2"
                  style={{ backgroundColor: game.categories.color + 'cc' }}
                >
                  {game.categories.icon} {language === 'en' ? game.categories.name_en : game.categories.name}
                </div>
              )}
              <h1 className="text-3xl md:text-4xl font-extrabold text-white">{game.name}</h1>
              {game.developer && (
                <p className="text-sm text-white/70 mt-1">{game.developer}</p>
              )}
            </div>
            <FavoriteButton
              isFavorite={isFavorite(game.id)}
              onToggle={() => toggleFavorite(game.id)}
            />
          </div>
        </div>
      </div>

      <div className="grid md:grid-cols-3 gap-6">
        {/* Main info */}
        <div className="md:col-span-2 space-y-5">
          {/* Description */}
          {desc && (
            <div className="glass rounded-2xl p-5">
              <h2 className="font-bold mb-3">📖 Descripción</h2>
              <p className="text-sm text-muted leading-relaxed">{desc}</p>
            </div>
          )}

          {/* Wiki link */}
          <Link
            href={`/wiki/${game.slug}`}
            className="glass rounded-2xl p-5 flex items-center justify-between hover:ring-1 hover:ring-blue-400 transition-all group"
          >
            <div>
              <h2 className="font-bold">📚 {t('wiki.title')}</h2>
              <p className="text-sm text-muted mt-0.5">Guías, consejos y recursos</p>
            </div>
            <span className="text-blue-400 group-hover:translate-x-1 transition-transform">→</span>
          </Link>

          {/* Purchase links */}
          {game.purchase_links?.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <h2 className="font-bold mb-3">🛒 {t('games.buyOn')}</h2>
              <div className="flex flex-wrap gap-2">
                {game.purchase_links.map((link, i) => (
                  <a
                    key={i}
                    href={link.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-4 py-2 rounded-xl bg-tertiary hover:bg-secondary transition-colors text-sm font-medium"
                  >
                    <span>{link.platform}</span>
                    <span className="text-blue-400 font-bold">{link.price}</span>
                    <span className="text-muted text-xs">↗</span>
                  </a>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Sidebar */}
        <div className="space-y-4">
          {/* Stats */}
          <div className="glass rounded-2xl p-5 space-y-4">
            {game.rating && (
              <div>
                <p className="text-xs text-muted uppercase tracking-wide mb-1">{t('games.rating')}</p>
                <div className="flex items-center gap-2">
                  <span className="text-yellow-400 text-lg">⭐</span>
                  <span className="text-2xl font-bold">{game.rating}</span>
                  <span className="text-muted">/10</span>
                </div>
              </div>
            )}
            {game.release_year && (
              <div>
                <p className="text-xs text-muted uppercase tracking-wide mb-1">{t('games.releaseYear')}</p>
                <p className="font-semibold">{game.release_year}</p>
              </div>
            )}
            {game.developer && (
              <div>
                <p className="text-xs text-muted uppercase tracking-wide mb-1">{t('games.developer')}</p>
                <p className="font-semibold">{game.developer}</p>
              </div>
            )}
          </div>

          {/* Platforms */}
          {game.platforms?.length > 0 && (
            <div className="glass rounded-2xl p-5">
              <p className="text-xs text-muted uppercase tracking-wide mb-3">{t('games.platforms')}</p>
              <div className="flex flex-wrap gap-2">
                {game.platforms.map((p) => (
                  <span key={p} className="px-2.5 py-1 rounded-lg bg-tertiary text-xs font-medium">
                    {p}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
