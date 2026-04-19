// lib/hooks/useWiki.ts
import { useEffect, useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { WikiSection } from '@/types';

export function useWiki(gameSlug: string) {
  const [sections, setSections] = useState<WikiSection[]>([]);
  const [gameName, setGameName] = useState('');
  const [gameId, setGameId] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchWiki = async () => {
      const supabase = createClient();
      setLoading(true);
      setError(null);

      const { data: game, error: gameErr } = await supabase
        .from('games')
        .select('id, name')
        .eq('slug', gameSlug)
        .single();

      if (gameErr || !game) {
        setError('Game not found');
        setLoading(false);
        return;
      }

      setGameName(game.name);
      setGameId(game.id);

      const { data, error: wikiErr } = await supabase
        .from('game_wiki')
        .select('*')
        .eq('game_id', game.id)
        .order('display_order');

      if (wikiErr) {
        setError('Error loading wiki');
      } else {
        setSections((data as WikiSection[]) ?? []);
      }
      setLoading(false);
    };

    if (gameSlug) fetchWiki();
  }, [gameSlug]);

  const addSection = async (section: Omit<WikiSection, 'id' | 'created_at'>) => {
    const supabase = createClient();
    const { data, error } = await supabase
      .from('game_wiki')
      .insert({ ...section, game_id: gameId })
      .select()
      .single();

    if (!error && data) {
      setSections((prev) => [...prev, data as WikiSection].sort((a, b) => a.display_order - b.display_order));
    }
    return { data, error };
  };

  return { sections, gameName, gameId, loading, error, addSection };
}
