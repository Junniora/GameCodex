// lib/hooks/useGames.ts
import { useEffect, useState, useCallback } from 'react';
import { createClient } from '@/lib/supabase/client';
import type { Game, Category } from '@/types';

export function useGames(categorySlug?: string, search?: string) {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchGames = useCallback(async () => {
    const supabase = createClient();
    setLoading(true);
    setError(null);

    try {
      let query = supabase
        .from('games')
        .select('*, categories(*)')
        .order('created_at', { ascending: false });

      if (categorySlug && categorySlug !== 'all') {
        const { data: cat } = await supabase
          .from('categories')
          .select('id')
          .eq('slug', categorySlug)
          .single();
        if (cat) query = query.eq('category_id', cat.id);
      }

      if (search) {
        query = query.ilike('name', `%${search}%`);
      }

      const { data, error: err } = await query;
      if (err) throw err;
      setGames((data as Game[]) ?? []);
    } catch (e) {
      setError('Error loading games');
      console.error(e);
    } finally {
      setLoading(false);
    }
  }, [categorySlug, search]);

  useEffect(() => {
    fetchGames();
  }, [fetchGames]);

  return { games, loading, error, refetch: fetchGames };
}

export function useGame(slug: string) {
  const [game, setGame] = useState<Game | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('games')
      .select('*, categories(*)')
      .eq('slug', slug)
      .single()
      .then(({ data }) => {
        setGame(data as Game);
        setLoading(false);
      });
  }, [slug]);

  return { game, loading };
}

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('categories')
      .select('*')
      .order('name')
      .then(({ data }) => {
        setCategories((data as Category[]) ?? []);
        setLoading(false);
      });
  }, []);

  return { categories, loading };
}

export function useFeaturedGames() {
  const [games, setGames] = useState<Game[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient();
    supabase
      .from('games')
      .select('*, categories(*)')
      .eq('is_featured', true)
      .limit(6)
      .then(({ data }) => {
        setGames((data as Game[]) ?? []);
        setLoading(false);
      });
  }, []);

  return { games, loading };
}
