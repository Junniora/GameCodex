// lib/hooks/useFavorites.ts
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Game } from '@/types';

export function useFavorites(userId?: string) {
  const [favorites, setFavorites] = useState<string[]>([]); // game IDs
  const [favoriteGames, setFavoriteGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchFavorites = useCallback(async () => {
    if (!userId) { setLoading(false); return; }
    const supabase = createClient();

    const { data } = await supabase
      .from('favorites')
      .select('game_id, games(*, categories(*))')
      .eq('user_id', userId);

    if (data) {
      setFavorites(data.map((f) => f.game_id));
      setFavoriteGames(data.map((f) => f.games as unknown as Game).filter(Boolean));
    }
    setLoading(false);
  }, [userId]);

  useEffect(() => {
    fetchFavorites();
  }, [fetchFavorites]);

  const toggleFavorite = async (gameId: string) => {
    if (!userId) return;
    const supabase = createClient();
    const isFav = favorites.includes(gameId);

    if (isFav) {
      await supabase
        .from('favorites')
        .delete()
        .eq('user_id', userId)
        .eq('game_id', gameId);
      setFavorites((prev) => prev.filter((id) => id !== gameId));
      setFavoriteGames((prev) => prev.filter((g) => g.id !== gameId));
    } else {
      await supabase
        .from('favorites')
        .insert({ user_id: userId, game_id: gameId });
      setFavorites((prev) => [...prev, gameId]);
      // Re-fetch to get game details
      fetchFavorites();
    }
  };

  const isFavorite = (gameId: string) => favorites.includes(gameId);

  return { favorites, favoriteGames, loading, toggleFavorite, isFavorite };
}
