'use client';
// app/(hub)/admin/page.tsx
import { useState } from 'react';
import { createClient } from '@/lib/supabase/client';
import { useAppStore } from '@/store/useAppStore';
import { useCategories } from '@/lib/hooks/useGames';

type Tab = 'category' | 'game' | 'wiki';

export default function AdminPage() {
  const { t, language } = useAppStore();
  const { categories, loading: catLoading } = useCategories();
  const [tab, setTab] = useState<Tab>('game');
  const [status, setStatus] = useState<'idle' | 'saving' | 'saved' | 'error'>('idle');

  /* ── Category form state ── */
  const [catForm, setCatForm] = useState({
    name: '', name_en: '', slug: '', icon: '🎮', color: '#6366f1',
    description: '', description_en: '',
  });

  /* ── Game form state ── */
  const [gameForm, setGameForm] = useState({
    name: '', slug: '', description: '', description_en: '',
    image_url: '', category_id: '', developer: '',
    platforms: '', rating: '', release_year: '', is_featured: false,
    purchase_links: '',
  });

  /* ── Wiki form state ── */
  const [wikiForm, setWikiForm] = useState({
    game_id: '', section_title: '', section_title_en: '',
    content: '', content_en: '', content_type: 'text', metadata: '{}', display_order: '0',
  });

  const save = async (table: string, data: Record<string, unknown>) => {
    setStatus('saving');
    const supabase = createClient();
    const { error } = await supabase.from(table).insert(data);
    setStatus(error ? 'error' : 'saved');
    setTimeout(() => setStatus('idle'), 2500);
  };

  const handleCategorySave = () => {
    save('categories', {
      ...catForm,
      slug: catForm.slug || catForm.name.toLowerCase().replace(/\s+/g, '-'),
    });
    setCatForm({ name: '', name_en: '', slug: '', icon: '🎮', color: '#6366f1', description: '', description_en: '' });
  };

  const handleGameSave = () => {
    save('games', {
      name: gameForm.name,
      slug: gameForm.slug || gameForm.name.toLowerCase().replace(/\s+/g, '-'),
      description: gameForm.description,
      description_en: gameForm.description_en,
      image_url: gameForm.image_url,
      category_id: gameForm.category_id || null,
      developer: gameForm.developer,
      platforms: gameForm.platforms.split(',').map((p) => p.trim()).filter(Boolean),
      rating: gameForm.rating ? parseFloat(gameForm.rating) : null,
      release_year: gameForm.release_year ? parseInt(gameForm.release_year) : null,
      is_featured: gameForm.is_featured,
      purchase_links: gameForm.purchase_links ? JSON.parse(gameForm.purchase_links) : [],
    });
  };

  const handleWikiSave = () => {
    save('game_wiki', {
      ...wikiForm,
      metadata: JSON.parse(wikiForm.metadata || '{}'),
      display_order: parseInt(wikiForm.display_order),
    });
  };

  const tabs: { id: Tab; label: string; icon: string }[] = [
    { id: 'category', label: t('admin.addCategory'), icon: '🗂️' },
    { id: 'game', label: t('admin.addGame'), icon: '🎮' },
    { id: 'wiki', label: t('admin.addWiki'), icon: '📚' },
  ];

  return (
    <div className="max-w-3xl mx-auto px-4 animate-fadeIn">
      <h1 className="text-3xl font-extrabold mb-6 flex items-center gap-2">
        ⚙️ {t('admin.title')}
      </h1>

      {/* Tabs */}
      <div className="flex gap-2 mb-6 glass p-1 rounded-2xl">
        {tabs.map(({ id, label, icon }) => (
          <button
            key={id}
            onClick={() => setTab(id)}
            className={`flex-1 flex items-center justify-center gap-2 px-4 py-2 rounded-xl text-sm font-semibold transition-all ${
              tab === id ? 'bg-blue-500 text-white' : 'text-muted hover:text-primary'
            }`}
          >
            {icon} {label}
          </button>
        ))}
      </div>

      {/* Status */}
      {status === 'saved' && (
        <div className="mb-4 p-3 rounded-xl bg-green-500/15 border border-green-500/20 text-green-400 text-sm animate-fadeIn">
          ✅ {t('admin.saved')}
        </div>
      )}
      {status === 'error' && (
        <div className="mb-4 p-3 rounded-xl bg-red-500/15 border border-red-500/20 text-red-400 text-sm animate-fadeIn">
          ❌ {t('admin.error')}
        </div>
      )}

      {/* Category Form */}
      {tab === 'category' && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <Row label={t('admin.categoryName')}>
            <input className="input-apple" value={catForm.name} onChange={(e) => setCatForm({ ...catForm, name: e.target.value })} />
          </Row>
          <Row label={t('admin.categoryNameEn')}>
            <input className="input-apple" value={catForm.name_en} onChange={(e) => setCatForm({ ...catForm, name_en: e.target.value })} />
          </Row>
          <Row label={t('admin.categorySlug')}>
            <input className="input-apple" placeholder="auto-generated" value={catForm.slug} onChange={(e) => setCatForm({ ...catForm, slug: e.target.value })} />
          </Row>
          <Row label={t('admin.categoryIcon')}>
            <input className="input-apple w-24" value={catForm.icon} onChange={(e) => setCatForm({ ...catForm, icon: e.target.value })} />
          </Row>
          <Row label={t('admin.categoryColor')}>
            <input type="color" className="h-10 w-16 rounded-lg cursor-pointer" value={catForm.color} onChange={(e) => setCatForm({ ...catForm, color: e.target.value })} />
          </Row>
          <button onClick={handleCategorySave} disabled={status === 'saving'} className="btn-primary w-full">
            {status === 'saving' ? '...' : t('admin.save')}
          </button>
        </div>
      )}

      {/* Game Form */}
      {tab === 'game' && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <Row label={t('admin.gameName')}>
            <input className="input-apple" value={gameForm.name} onChange={(e) => setGameForm({ ...gameForm, name: e.target.value })} />
          </Row>
          <Row label={t('admin.gameCategory')}>
            <select className="input-apple" value={gameForm.category_id} onChange={(e) => setGameForm({ ...gameForm, category_id: e.target.value })}>
              <option value="">— Seleccionar —</option>
              {categories.map((c) => (
                <option key={c.id} value={c.id}>{c.icon} {language === 'en' ? c.name_en : c.name}</option>
              ))}
            </select>
          </Row>
          <Row label={t('admin.gameDescription')}>
            <textarea className="input-apple resize-none" rows={3} value={gameForm.description} onChange={(e) => setGameForm({ ...gameForm, description: e.target.value })} />
          </Row>
          <Row label={t('admin.gameDescriptionEn')}>
            <textarea className="input-apple resize-none" rows={3} value={gameForm.description_en} onChange={(e) => setGameForm({ ...gameForm, description_en: e.target.value })} />
          </Row>
          <Row label={t('admin.gameImageUrl')}>
            <input className="input-apple" type="url" value={gameForm.image_url} onChange={(e) => setGameForm({ ...gameForm, image_url: e.target.value })} />
          </Row>
          <Row label={t('admin.gamePlatforms')}>
            <input className="input-apple" placeholder="PC, PS5, Xbox, Switch" value={gameForm.platforms} onChange={(e) => setGameForm({ ...gameForm, platforms: e.target.value })} />
          </Row>
          <div className="grid grid-cols-2 gap-4">
            <Row label={t('admin.gameRating')}>
              <input className="input-apple" type="number" min="0" max="10" step="0.1" value={gameForm.rating} onChange={(e) => setGameForm({ ...gameForm, rating: e.target.value })} />
            </Row>
            <Row label={t('admin.gameDeveloper')}>
              <input className="input-apple" value={gameForm.developer} onChange={(e) => setGameForm({ ...gameForm, developer: e.target.value })} />
            </Row>
          </div>
          <Row label="Destacado">
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={gameForm.is_featured} onChange={(e) => setGameForm({ ...gameForm, is_featured: e.target.checked })} className="w-4 h-4 rounded" />
              <span className="text-sm">Featured</span>
            </label>
          </Row>
          <button onClick={handleGameSave} disabled={status === 'saving'} className="btn-primary w-full">
            {status === 'saving' ? '...' : t('admin.save')}
          </button>
        </div>
      )}

      {/* Wiki Form */}
      {tab === 'wiki' && (
        <div className="glass rounded-2xl p-6 space-y-4">
          <Row label="Game ID">
            <input className="input-apple font-mono text-xs" placeholder="UUID del juego" value={wikiForm.game_id} onChange={(e) => setWikiForm({ ...wikiForm, game_id: e.target.value })} />
          </Row>
          <Row label="Título sección (ES)">
            <input className="input-apple" value={wikiForm.section_title} onChange={(e) => setWikiForm({ ...wikiForm, section_title: e.target.value })} />
          </Row>
          <Row label="Título sección (EN)">
            <input className="input-apple" value={wikiForm.section_title_en} onChange={(e) => setWikiForm({ ...wikiForm, section_title_en: e.target.value })} />
          </Row>
          <Row label="Tipo de contenido">
            <select className="input-apple" value={wikiForm.content_type} onChange={(e) => setWikiForm({ ...wikiForm, content_type: e.target.value })}>
              {['text','table','tips','layers','list'].map((t) => (
                <option key={t} value={t}>{t}</option>
              ))}
            </select>
          </Row>
          <Row label="Contenido (ES)">
            <textarea className="input-apple resize-none" rows={3} value={wikiForm.content} onChange={(e) => setWikiForm({ ...wikiForm, content: e.target.value })} />
          </Row>
          <Row label="Contenido (EN)">
            <textarea className="input-apple resize-none" rows={3} value={wikiForm.content_en} onChange={(e) => setWikiForm({ ...wikiForm, content_en: e.target.value })} />
          </Row>
          <Row label="Metadata (JSON)">
            <textarea className="input-apple resize-none font-mono text-xs" rows={5} value={wikiForm.metadata} onChange={(e) => setWikiForm({ ...wikiForm, metadata: e.target.value })} />
          </Row>
          <button onClick={handleWikiSave} disabled={status === 'saving'} className="btn-primary w-full">
            {status === 'saving' ? '...' : t('admin.save')}
          </button>
        </div>
      )}
    </div>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <label className="block text-sm font-medium mb-1.5 text-muted">{label}</label>
      {children}
    </div>
  );
}
